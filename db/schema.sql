create table events(
	id serial,
	name varchar,
	host varchar,
	description varchar,
	lat decimal,
	long decimal,
	Primary key (id)
);

create table dates(
	id serial,
	start_date varchar,
	end_date varchar,
	fk_event int,
	primary key (id),
	foreign key (fk_event) references public.events(id) 
);