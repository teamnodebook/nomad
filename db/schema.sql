-- postgres schemas

create table public.events(
	id serial,
	name varchar,
	host varchar,
	description varchar,
	lat decimal,
	long decimal,
	paypal varchar,
	Primary key (id)
);

create table public.dates(
	id serial,
	start_date varchar,
	end_date varchar,
	fk_event int,
	primary key (id),
	foreign key (fk_event) references public.events(id) 
);

create table public.users(
	id serial,
	userevent int,
	username varchar
	name varchar,
	email varchar,
	password varchar,
	primary key(id),
	foreign key (userevent) references public.events(id)
);

-- query for finding db items that fall within requested radius
select name, host, description, lat, long, start_date, end_date 
			from events inner join dates on dates.fk_event = events.id  
			WHERE acos(sin(LAT_CENTERPOINT_RAIDIANS) * sin(lat) + cos(LAT_CENTERPOINT_RAIDIANS) 
								* cos(lat) * cos(long - (LONG_CENTERPOINT_RAIDIANS))) * 6371 <= KILOMETERS;

select name, start_date, username
			from events inner join dates on dates.fk_event = events.id 
			inner join users on users.userevent = events.id;


