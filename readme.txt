typeorm-model-generator -h localhost -d tempdb -u sa -x !Passw0rd -e mssql -o .

typeorm-model-generator -h 192.169.0.100 -d poc1 -u root -x admin -p 3306 -e mysql -o "./src/db" --cf param --ce camel  --skipSchema --npConfig --lazy

typeorm-model-generator -h 192.169.0.100 -d poc1 -u root -x admin -p 3306 -e mysql -o "./src/db" --cf param --ce camel  --skipSchema --npConfig --lazy --namingStrategy=./NamingStrategy

typeorm-model-generator -h 192.169.0.100 -d poc1 -u root -x admin -p 3306 -e mysql  -o "./src/db" -l ts --cp camel --namingStrategy=./NamingStrategy


typeorm-model-generator -h 192.169.0.100 -d poc1 -u root -x admin -p 3306 -e mysql -o "./src/db"  --cf none --skipSchema --npConfig --lazy --namingStrategy=./naming_strategy