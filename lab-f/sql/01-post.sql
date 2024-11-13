create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);
create table car
(
     id integer not null
        CONSTRAINT car_pk
        primary key autoincrement,
     carBrand text not null,
     model text not null,
     year integer not null,
     description text not null
);
