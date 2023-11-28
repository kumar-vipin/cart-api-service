-- public.carts definition

-- Drop table

-- DROP TABLE public.carts;

CREATE TABLE public.carts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"userId" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" date NOT NULL DEFAULT now(),
	"updatedAt" date NOT NULL DEFAULT now(),
	status public."carts_status_enum" NOT NULL DEFAULT 'OPEN'::carts_status_enum,
	CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY (id)
);


-- public.orders definition

-- Drop table

-- DROP TABLE public.orders;

CREATE TABLE public.orders (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"userId" uuid NOT NULL,
	"cartId" uuid NOT NULL,
	payment jsonb NOT NULL,
	delivery jsonb NOT NULL,
	"comments" text NOT NULL,
	status public."orders_status_enum" NOT NULL DEFAULT 'OPEN'::orders_status_enum,
	total int4 NOT NULL,
	CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id)
);


-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text NOT NULL,
	price int4 NOT NULL,
	CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	email text NULL,
	"password" text NOT NULL,
	CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id)
);


-- public.cart_items definition

-- Drop table

-- DROP TABLE public.cart_items;

CREATE TABLE public.cart_items (
	"cartId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	count int4 NOT NULL DEFAULT 1,
	cart_id uuid NULL,
	product_id uuid NULL,
	CONSTRAINT "PK_2bf7996b7946ce753b60a87468c" PRIMARY KEY ("cartId", "productId"),
	CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY (product_id) REFERENCES public.products(id),
	CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE
);
