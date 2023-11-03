#SELECT store_id, sum(price) FROM computer_consignment.Computers WHERE is_available = 0 GROUP BY store_id;
#SELECT * FROM computer_consignment.Computers;
#SELECT * FROM computer_consignment.Store;

USE computer_consignment;
SELECT Computers.store_id, Store.store_name ,sum(Computers.price) 
FROM Computers 
INNER JOIN Store
ON Computers.store_id = Store.store_id
GROUP BY Computers.store_id; 