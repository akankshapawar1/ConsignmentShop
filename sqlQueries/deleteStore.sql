USE computer_consignment;

#DESCRIBE Store;

#ALTER TABLE Store
#ADD COLUMN is_available BOOL AFTER credentials;

#SELECT * FROM Store;

#SELECT * FROM Computers;

#UPDATE Store SET is_available = 0 WHERE store_id = 1018;

# The only time a store would be updated would be when the store is getting deleted, that is is_available is getting set to 0.
# So we can add a trigger/function for each update on the store. 
# Can a trigger update another table? Or do we have to join tables before displaying computers to the customer?
# Much easier to delete the store instead

#DELETE FROM Store WHERE store_id = 1021;

#SHOW CREATE TABLE Computer;

#ALTER TABLE Computer
#ADD CONSTRAINT Computer_ibfk_2
#FOREIGN KEY (store_id) REFERENCES Store (store_id)
#ON DELETE CASCADE;

ALTER TABLE Computer DROP FOREIGN KEY Computer_ibfk_1;
