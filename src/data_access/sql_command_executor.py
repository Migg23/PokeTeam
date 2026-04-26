# starts the connection with our database
from contextlib import contextmanager
from os import getenv

from dotenv import load_dotenv
import pymssql


class SqlCommandExecutor:
    def __init__(self):
        load_dotenv()

        self.host = getenv("DB_HOST")
        self.port = int(getenv("DB_PORT", "1433"))
        self.database = getenv("DB_NAME")
        self.user = getenv("DB_USER")
        self.password = getenv("DB_PASSWORD")
        self.schema = getenv("DB_SCHEMA")

    def get_connection(self):
        return pymssql.connect(
            server=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            database=self.database,
        )

    @contextmanager
    def transaction_scope(self):
        connection = self.get_connection()

        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    @staticmethod
    def stringify_in_params(params):
        if not params:
            return ""

        return ", ".join(f"@{key} = %s" for key in params.keys())

    @staticmethod
    def stringify_out_params(params):
        if not params:
            return ""

        return ", ".join(f"@{param} = @{param} OUTPUT" for param in params)

    def execute_query(self, sql, connection, params=None):
        cursor = connection.cursor(as_dict=True)

        if params:
            cursor.execute(sql, tuple(params.values()))
        else:
            cursor.execute(sql)

        return cursor

    @staticmethod
    def get_all_rows(cursor):
        rows = cursor.fetchall()
        cursor.close()
        return rows
