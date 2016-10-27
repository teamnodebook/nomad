-- postgres schemas

create table public.users(
	id serial,
	name varchar,
	email varchar,
	password varchar,
	primary key(id)
);

create table public.events(
	id serial,
	name varchar,
	host varchar,
	description varchar,
	lat decimal,
	long decimal,
	userid int,
	paypal varchar,
	Primary key (id),
	foreign key (userid) references public.users(id)
);

create table public.dates(
	id serial,
	start_date varchar,
	end_date varchar,
	fk_event int,
	primary key (id),
	foreign key (fk_event) references public.events(id)
);


-- query for finding db items that fall within requested radius
select name, host, description, lat, long, start_date, end_date 
			from events inner join dates on dates.fk_event = events.id  
			WHERE acos(sin(LAT_CENTERPOINT_RAIDIANS) * sin(lat) + cos(LAT_CENTERPOINT_RAIDIANS) 
								* cos(lat) * cos(long - (LONG_CENTERPOINT_RAIDIANS))) * 6371 <= KILOMETERS;

-- select name, username, description
-- 			from events inner join users on users.id = events.userid


