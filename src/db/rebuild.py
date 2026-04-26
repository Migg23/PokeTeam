# this rebuild script discovers and executes the SQL files for the project
from pathlib import Path
import re
from typing import Iterable

from src.data_access.sql_command_executor import SqlCommandExecutor


ROOT = Path(__file__).resolve().parents[2]
SQL_ROOT = ROOT / "src" / "pokemonApp" / "sql"

SCHEMA_DIR = SQL_ROOT / "Schemas"
TABLE_DIR = SQL_ROOT / "Tables"
PROCEDURE_DIR = SQL_ROOT / "Procedures"
DATA_DIR = SQL_ROOT / "Data"

GO_LINE = re.compile(r"^\s*GO(?:\s+\d+)?\s*$", re.IGNORECASE)


def get_sql_files(directory: Path) -> list[Path]:
    if not directory.exists():
        return []

    return sorted(path for path in directory.glob("*.sql") if path.is_file())


def split_sql_batches(sql_text: str) -> list[str]:
    batches = []
    current_batch = []

    for line in sql_text.splitlines():
        if GO_LINE.match(line):
            batch = "\n".join(current_batch).strip()
            if batch:
                batches.append(batch)
            current_batch = []
        else:
            current_batch.append(line)

    final_batch = "\n".join(current_batch).strip()
    if final_batch:
        batches.append(final_batch)

    return batches


def execute_files(executor: SqlCommandExecutor, files: Iterable[Path]):
    with executor.transaction_scope() as connection:
        for file_path in files:
            sql_text = file_path.read_text(encoding="utf-8").strip()
            if not sql_text:
                continue

            batches = split_sql_batches(sql_text)

            for batch in batches:
                executor.execute_query(batch, connection)


def run_rebuild():
    executor = SqlCommandExecutor()
    files = []
    files.extend(get_sql_files(SCHEMA_DIR))
    files.extend(get_sql_files(TABLE_DIR))
    files.extend(get_sql_files(PROCEDURE_DIR))
    files.extend(get_sql_files(DATA_DIR))

    if not files:
        raise FileNotFoundError(f"No SQL files were found under {SQL_ROOT}")

    execute_files(executor, files)


def run_seed_only():
    executor = SqlCommandExecutor()
    data_files = get_sql_files(DATA_DIR)

    if not data_files:
        raise FileNotFoundError(f"No data SQL files were found under {DATA_DIR}")

    execute_files(executor, data_files)


if __name__ == "__main__":
    run_rebuild()
