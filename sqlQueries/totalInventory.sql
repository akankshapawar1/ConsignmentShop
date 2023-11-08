USE computer_consignment;
#SELECT Computer.store_id, Store.store_name ,sum(Computer.price) 
#FROM Computer
#INNER JOIN Store
#ON Computer.store_id = Store.store_id
#GROUP BY Computer.store_id; 

SELECT Store.store_id, Store.store_name, COALESCE(sum(Computer.price),0) AS Inventory
FROM Store
LEFT JOIN Computer
ON Computer.store_id = Store.store_id
WHERE Store.is_available = 1 AND Computer.is_available = 1
GROUP BY Store.store_id
ORDER BY Inventory DESC;
