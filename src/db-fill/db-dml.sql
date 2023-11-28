INSERT INTO public.cart_items ("cartId","productId",count,cart_id,product_id) VALUES
	 ('50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','1ebe99fa-0f43-42ff-823f-0356fc6635d3',3,'50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','1ebe99fa-0f43-42ff-823f-0356fc6635d3'),
	 ('50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','f81fa9de-8ae5-43d2-bbf0-89413fcf23b2',7,'50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','f81fa9de-8ae5-43d2-bbf0-89413fcf23b2'),
	 ('50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','546aab96-2d47-4d89-bcef-1f145a9aa1a0',2,'50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','546aab96-2d47-4d89-bcef-1f145a9aa1a0');

INSERT INTO public.carts (id,"userId","createdAt","updatedAt",status) VALUES
	 ('50e3c5d1-a395-4a13-85e1-cc631fb9b9a4','2a00bcbe-9bc3-4581-97b3-41c8089dfeef','2023-11-27','2023-11-27','ORDERED');

INSERT INTO public.orders (id,"userId","cartId",payment,delivery,"comments",status,total) VALUES
	 ('c2cb764c-dd0a-4be3-95ac-fbfd4109b9ed','2a00bcbe-9bc3-4581-97b3-41c8089dfeef','8c15b7d5-03bf-4678-9a33-bf3b03356933','{"type": "COD"}','{"type": "DTDC", "address": "Pune"}','Your parcel will delivered tomorrow','ORDERED',206);

INSERT INTO public.products (id,title,description,price) VALUES
	 ('1ebe99fa-0f43-42ff-823f-0356fc6635d3','Product 1','Product 1',21),
	 ('546aab96-2d47-4d89-bcef-1f145a9aa1a0','Product 2','Product 2',12),
	 ('f81fa9de-8ae5-43d2-bbf0-89413fcf23b2','Product 3','Product 3',17);

INSERT INTO public.users (id,"name",email,"password") VALUES
	 ('2a00bcbe-9bc3-4581-97b3-41c8089dfeef','VIPIN KUMAR','vipin@gmail.com','sayhello2vipin'),
	 ('9e890ce0-4d0d-455e-b0ec-2cd70f2ffe56','Ramesh KUMAR','ramesh@gmail.com','sayhello2ramesh');
