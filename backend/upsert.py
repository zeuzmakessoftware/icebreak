#python
import csv
import os
import unicodedata
from pinecone import Pinecone
import dotenv

def sanitize_for_id(text: str) -> str:
    """
    Converts a string to a safe, ASCII-only representation for use in an ID.
    - Converts to lowercase.
    - Replaces spaces with underscores.
    - Transliterates non-ASCII characters (like í, ñ) to their ASCII equivalents.
    """
    # Normalize the string to separate base characters from accents
    nfkd_form = unicodedata.normalize('NFKD', text.lower())
    # Encode to ASCII, ignoring the non-ASCII combining characters (the accents)
    ascii_string = nfkd_form.encode('ascii', 'ignore').decode('ascii')
    # Replace spaces with underscores
    return ascii_string.replace(' ', '_')

def main():
    """
    Reads Q&A data from a CSV, and upserts it into a Pinecone index
    using the integrated embedding API to vectorize the 'answer' field.
    """
    dotenv.load_dotenv("../.env.local")
    # --- 1. Configuration ---
    try:
        api_key = os.getenv("PINECONE_API_KEY")
        host = os.getenv("PINECONE_INDEX_HOST")
    except KeyError as e:
        print(f"Error: Please set the {e} environment variable.")
        return

    csv_filename = '../data/q_and_a.csv'
    batch_size = 96
    namespace = "q-and-a-knowledge-base"
    text_field_to_embed = "answer"

    # --- 2. Initialize Pinecone Client ---
    print("Initializing Pinecone client...")
    pc = Pinecone(api_key=api_key)
    index = pc.Index(host=host)
    print(f"Successfully connected to index: {host}")
    print(f"Upserting to namespace: '{namespace}'")

    # --- 3. Prepare and Upsert Data in Batches ---
    records_to_upsert = []
    total_records_processed = 0

    with open(csv_filename, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        fieldnames = reader.fieldnames or []

        print(f"Reading from {csv_filename} and preparing records...")
        for row_num, row in enumerate(reader):
            question = row.get('Question', '').strip()
            if not question:
                continue

            for person in fieldnames:
                if person == 'Question':
                    continue

                answer = row.get(person, '').strip()
                if not answer:
                    continue

                # *** MODIFICATION HERE ***
                # Sanitize the person's name to create a safe, ASCII-only ID
                safe_person_id = sanitize_for_id(person)
                record_id = f"q{row_num}-{safe_person_id}"

                record = {
                    "id": record_id,
                    text_field_to_embed: answer,
                    "question": question,
                    "person": person  # Keep the original name in metadata
                }
                records_to_upsert.append(record)
                total_records_processed += 1

                if len(records_to_upsert) >= batch_size:
                    print(f"Upserting batch of {len(records_to_upsert)} records...")
                    index.upsert_records(
                        namespace=namespace,
                        records=records_to_upsert
                    )
                    records_to_upsert.clear()

    if records_to_upsert:
        print(f"Upserting final batch of {len(records_to_upsert)} records...")
        index.upsert_records(
            namespace=namespace,
            records=records_to_upsert
        )

    print(f"\nUpsert complete.")
    print(f"Total records processed and sent to Pinecone: {total_records_processed}")

    stats = index.describe_index_stats()
    print(f"\nIndex stats: {stats}")


if __name__ == '__main__':
    print("--- Pinecone Data Upsert Script ---")
    print("This script uses the integrated embedding API.")
    print("Ensure PINECONE_API_KEY and PINECONE_INDEX_HOST are set.")
    print("Ensure the target index is configured to embed the 'answer' field.")
    print("-" * 35)
    main()