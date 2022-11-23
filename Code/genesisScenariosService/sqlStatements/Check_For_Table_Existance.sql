SELECT count(*)
FROM information_schema.TABLES
WHERE (TABLE_SCHEMA = 'Test_Schmea') AND (TABLE_NAME = 'spacecraft');