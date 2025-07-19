--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-07-19 16:43:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 24994)
-- Name: course_instructors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_instructors (
    course_instructor_id integer NOT NULL,
    course_id integer,
    instructor_id integer
);


ALTER TABLE public.course_instructors OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24993)
-- Name: course_instructors_course_instructor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_instructors_course_instructor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_instructors_course_instructor_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 225
-- Name: course_instructors_course_instructor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_instructors_course_instructor_id_seq OWNED BY public.course_instructors.course_instructor_id;


--
-- TOC entry 220 (class 1259 OID 24950)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    course_name character varying(100) NOT NULL,
    course_code character varying(20) NOT NULL,
    credits integer,
    department character varying(50) NOT NULL,
    CONSTRAINT courses_credits_check CHECK ((credits > 0))
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24949)
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 219
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- TOC entry 222 (class 1259 OID 24962)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    enrollment_id integer NOT NULL,
    student_id integer,
    course_id integer,
    enrollment_date date DEFAULT CURRENT_DATE NOT NULL,
    grade character(2),
    CONSTRAINT enrollments_grade_check CHECK ((grade = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar, 'F'::bpchar, 'I'::bpchar])))
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24961)
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_enrollment_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 221
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_enrollment_id_seq OWNED BY public.enrollments.enrollment_id;


--
-- TOC entry 224 (class 1259 OID 24983)
-- Name: instructors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instructors (
    instructor_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15)
);


ALTER TABLE public.instructors OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24982)
-- Name: instructors_instructor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instructors_instructor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instructors_instructor_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 223
-- Name: instructors_instructor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instructors_instructor_id_seq OWNED BY public.instructors.instructor_id;


--
-- TOC entry 228 (class 1259 OID 25032)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    student_id integer,
    amount numeric(10,2) NOT NULL,
    payment_date date DEFAULT CURRENT_DATE NOT NULL,
    payment_method character varying(50),
    CONSTRAINT payments_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT payments_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['Credit Card'::character varying, 'Bank Transfer'::character varying, 'Cash'::character varying, 'Scholarship'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25031)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 227
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 218 (class 1259 OID 24935)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10),
    email character varying(100) NOT NULL,
    phone character varying(15),
    address text,
    enrollment_date date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT students_gender_check CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying])::text[])))
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24934)
-- Name: students_student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_student_id_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 217
-- Name: students_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_student_id_seq OWNED BY public.students.student_id;


--
-- TOC entry 229 (class 1259 OID 32899)
-- Name: students_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.students_view AS
 SELECT s.student_id,
    s.first_name,
    s.last_name,
    s.date_of_birth,
    s.gender,
    s.email,
    s.phone,
    s.address,
    s.enrollment_date AS student_enrollment_date,
    e.enrollment_id,
    e.enrollment_date,
    e.grade,
    c.course_id,
    c.course_name,
    c.course_code,
    c.credits,
    c.department,
    i.instructor_id,
    i.first_name AS instructor_first_name,
    i.last_name AS instructor_last_name,
    i.email AS instructor_email,
    i.phone AS instructor_phone,
    p.payment_id,
    p.amount,
    p.payment_date,
    p.payment_method
   FROM (((((public.students s
     LEFT JOIN public.enrollments e ON ((s.student_id = e.student_id)))
     LEFT JOIN public.courses c ON ((e.course_id = c.course_id)))
     LEFT JOIN public.course_instructors ci ON ((c.course_id = ci.course_id)))
     LEFT JOIN public.instructors i ON ((ci.instructor_id = i.instructor_id)))
     LEFT JOIN public.payments p ON ((s.student_id = p.student_id)));


ALTER VIEW public.students_view OWNER TO postgres;

--
-- TOC entry 4778 (class 2604 OID 24997)
-- Name: course_instructors course_instructor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_instructors ALTER COLUMN course_instructor_id SET DEFAULT nextval('public.course_instructors_course_instructor_id_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 24953)
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 24965)
-- Name: enrollments enrollment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN enrollment_id SET DEFAULT nextval('public.enrollments_enrollment_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 24986)
-- Name: instructors instructor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructors ALTER COLUMN instructor_id SET DEFAULT nextval('public.instructors_instructor_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 25035)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 24938)
-- Name: students student_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN student_id SET DEFAULT nextval('public.students_student_id_seq'::regclass);


--
-- TOC entry 4974 (class 0 OID 24994)
-- Dependencies: 226
-- Data for Name: course_instructors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_instructors (course_instructor_id, course_id, instructor_id) FROM stdin;
1	1	20
2	2	19
3	3	18
4	4	17
5	5	16
6	6	15
7	7	14
8	8	13
9	9	12
10	10	11
11	11	10
12	12	9
13	13	8
14	14	7
15	15	6
16	16	5
17	17	4
18	18	3
19	19	2
20	20	1
21	1	2
22	2	3
23	3	4
24	4	5
25	5	6
26	6	7
27	7	8
28	8	9
29	9	10
30	10	9
31	11	12
32	12	13
33	13	14
34	14	15
35	15	16
36	16	17
37	17	18
38	18	19
39	19	20
40	2	4
41	3	6
42	4	7
43	10	2
44	15	3
\.


--
-- TOC entry 4968 (class 0 OID 24950)
-- Dependencies: 220
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name, course_code, credits, department) FROM stdin;
1	Introduction to Biology	BIO101	3	Science
2	Calculus I	MATH101	4	Mathematics
3	World History	HIST101	3	History
4	English Literature	ENG101	3	Arts
5	Fundamentals of Engineering	ENGR101	4	Engineering
6	Chemistry Basics	CHEM101	3	Science
7	Introduction to Psychology	PSY101	3	Social Sciences
8	Computer Science Fundamentals	CS101	4	Technology
9	Economics Principles	ECON101	3	Social Sciences
10	Introduction to Philosophy	PHIL101	3	Arts
11	Advanced Biology	BIO201	4	Science
12	Calculus II	MATH201	4	Mathematics
13	Modern History	HIST201	3	History
14	Creative Writing	ENG201	3	Arts
15	Mechanical Engineering	ENGR201	4	Engineering
16	Organic Chemistry	CHEM201	4	Science
17	Cognitive Psychology	PSY201	3	Social Sciences
18	Data Structures	CS201	4	Technology
19	Microeconomics	ECON201	3	Social Sciences
20	Ethics in Philosophy	PHIL201	3	Arts
\.


--
-- TOC entry 4970 (class 0 OID 24962)
-- Dependencies: 222
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (enrollment_id, student_id, course_id, enrollment_date, grade) FROM stdin;
1	1	1	2022-09-01	A 
2	1	2	2022-09-02	B 
3	1	3	2022-09-03	A 
4	2	2	2022-09-01	B 
5	2	4	2022-09-03	C 
6	3	3	2022-09-02	C 
7	3	7	2022-09-04	A 
8	4	4	2022-09-05	D 
9	4	8	2022-09-06	B 
10	4	9	2022-09-07	C 
11	5	5	2022-09-07	F 
12	5	9	2022-09-08	C 
13	6	10	2022-09-10	A 
14	6	11	2022-09-11	B 
15	7	11	2022-09-12	A 
16	8	12	2022-09-14	B 
17	8	13	2022-09-15	A 
18	9	13	2022-09-16	C 
19	10	14	2022-09-18	D 
20	10	15	2022-09-19	A 
21	11	11	2022-09-19	A 
22	11	15	2022-09-20	A 
23	11	16	2022-09-21	I 
24	12	12	2022-09-21	B 
25	12	16	2022-09-22	I 
26	13	17	2022-09-24	C 
27	13	18	2022-09-25	B 
28	14	18	2022-09-26	B 
29	14	19	2022-09-27	C 
30	15	4	2022-09-28	C 
31	15	19	2022-09-28	C 
32	15	20	2022-09-29	D 
33	16	20	2022-09-30	B 
34	17	17	2022-10-01	A 
35	17	1	2022-10-02	B 
36	18	2	2022-10-04	C 
37	19	3	2022-10-06	A 
38	20	4	2022-10-08	B 
39	20	5	2022-10-09	A 
\.


--
-- TOC entry 4972 (class 0 OID 24983)
-- Dependencies: 224
-- Data for Name: instructors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instructors (instructor_id, first_name, last_name, email, phone) FROM stdin;
1	Alan	Turing	alan.turing@example.com	555-1001
2	Ada	Lovelace	ada.lovelace@example.com	555-1002
3	Grace	Hopper	grace.hopper@example.com	555-1003
4	Tim	Berners-Lee	tim.lee@example.com	555-1004
5	Linus	Torvalds	linus.torvalds@example.com	555-1005
6	Margaret	Hamilton	margaret.hamilton@example.com	555-1006
7	Dennis	Ritchie	dennis.ritchie@example.com	555-1007
8	James	Gosling	james.gosling@example.com	555-1008
9	Guido	van Rossum	guido.rossum@example.com	555-1009
10	Bjarne	Stroustrup	bjarne.stroustrup@example.com	555-1010
11	Ken	Thompson	ken.thompson@example.com	555-1011
12	Brian	Kernighan	brian.kernighan@example.com	555-1012
13	John	McCarthy	john.mccarthy@example.com	555-1013
14	Edsger	Dijkstra	edsger.dijkstra@example.com	555-1014
15	Donald	Knuth	donald.knuth@example.com	555-1015
16	Barbara	Liskov	barbara.liskov@example.com	555-1016
17	Frances	Allen	frances.allen@example.com	555-1017
18	Yukihiro	Matsumoto	yukihiro.matsumoto@example.com	555-1018
19	Steve	Jobs	steve.jobs@example.com	555-1019
20	Bill	Gates	bill.gates@example.com	555-1020
\.


--
-- TOC entry 4976 (class 0 OID 25032)
-- Dependencies: 228
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, student_id, amount, payment_date, payment_method) FROM stdin;
1	1	1500.00	2022-08-15	Credit Card
2	2	2000.00	2022-08-16	Bank Transfer
3	3	1800.50	2022-08-17	Cash
4	4	1000.00	2022-08-18	Scholarship
5	5	2500.75	2022-08-19	Credit Card
6	6	3000.00	2022-08-20	Bank Transfer
7	7	1500.25	2022-08-21	Cash
8	8	1800.00	2022-08-22	Scholarship
9	9	2000.00	2022-08-23	Credit Card
10	10	2200.00	2022-08-24	Bank Transfer
11	11	2100.00	2022-08-25	Cash
12	12	1900.00	2022-08-26	Scholarship
13	13	2300.00	2022-08-27	Credit Card
14	14	1700.00	2022-08-28	Bank Transfer
15	15	1600.00	2022-08-29	Cash
16	16	2400.00	2022-08-30	Scholarship
17	17	2500.00	2022-08-31	Credit Card
18	18	2600.00	2022-09-01	Bank Transfer
19	19	2700.00	2022-09-02	Cash
20	20	2800.00	2022-09-03	Scholarship
\.


--
-- TOC entry 4966 (class 0 OID 24935)
-- Dependencies: 218
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, first_name, last_name, date_of_birth, gender, email, phone, address, enrollment_date) FROM stdin;
1	Alice	Smith	2000-05-15	Female	alice.smith@example.com	555-0100	123 Main St, New York, NY	2022-09-01
2	Bob	Johnson	1999-07-20	Male	bob.johnson@example.com	555-0101	456 Oak Ave, Los Angeles, CA	2022-09-02
3	Carol	Williams	2001-02-10	Female	carol.williams@example.com	555-0102	789 Pine Rd, Chicago, IL	2022-09-03
4	David	Brown	1998-11-30	Male	david.brown@example.com	555-0103	321 Maple St, Houston, TX	2022-09-04
5	Eva	Jones	2000-03-25	Female	eva.jones@example.com	555-0104	654 Cedar Ave, Philadelphia, PA	2022-09-05
6	Frank	Garcia	1997-08-18	Male	frank.garcia@example.com	555-0105	987 Spruce Rd, Phoenix, AZ	2022-09-06
7	Grace	Martinez	2001-12-05	Female	grace.martinez@example.com	555-0106	159 Walnut St, San Antonio, TX	2022-09-07
8	Henry	Rodriguez	1999-06-22	Male	henry.rodriguez@example.com	555-0107	753 Birch Ave, San Diego, CA	2022-09-08
9	Ivy	Lee	2000-10-14	Female	ivy.lee@example.com	555-0108	852 Cherry Rd, Dallas, TX	2022-09-09
10	Jack	Walker	1998-04-03	Male	jack.walker@example.com	555-0109	951 Elm St, San Jose, CA	2022-09-10
11	Karen	Hall	2001-07-12	Female	karen.hall@example.com	555-0110	147 Willow Ave, Austin, TX	2022-09-11
12	Leo	Allen	1999-09-09	Male	leo.allen@example.com	555-0111	258 Aspen Rd, Jacksonville, FL	2022-09-12
13	Mona	Young	2000-12-20	Female	mona.young@example.com	555-0112	369 Poplar St, Fort Worth, TX	2022-09-13
14	Ned	Hernandez	1998-03-03	Male	ned.hernandez@example.com	555-0113	741 Fir Ave, Columbus, OH	2022-09-14
15	Olivia	King	2001-01-17	Female	olivia.king@example.com	555-0114	852 Hemlock Rd, Charlotte, NC	2022-09-15
16	Paul	Wright	1997-07-07	Male	paul.wright@example.com	555-0115	963 Sycamore St, San Francisco, CA	2022-09-16
17	Quincy	Lopez	2000-06-06	Male	quincy.lopez@example.com	555-0116	147 Cypress Ave, Indianapolis, IN	2022-09-17
18	Rachel	Hill	2001-05-05	Female	rachel.hill@example.com	555-0117	258 Redwood Rd, Seattle, WA	2022-09-18
19	Steve	Scott	1999-11-11	Male	steve.scott@example.com	555-0118	369 Magnolia St, Denver, CO	2022-09-19
20	Tina	Green	2000-08-08	Female	tina.green@example.com	555-0119	741 Dogwood Ave, Washington, DC	2022-09-20
\.


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 225
-- Name: course_instructors_course_instructor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_instructors_course_instructor_id_seq', 44, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 219
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 20, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 221
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_enrollment_id_seq', 39, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 223
-- Name: instructors_instructor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instructors_instructor_id_seq', 20, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 227
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 20, true);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 217
-- Name: students_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_student_id_seq', 20, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT USAGE ON SCHEMA public TO admin_user;


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE course_instructors; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.course_instructors TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.course_instructors TO admin_user;


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE courses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.courses TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.courses TO admin_user;


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE enrollments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.enrollments TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.enrollments TO admin_user;


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE instructors; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.instructors TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.instructors TO admin_user;


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.payments TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.payments TO admin_user;


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.students TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.students TO admin_user;


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE students_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.students_view TO readonly_user;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.students_view TO admin_user;


-- Completed on 2025-07-19 16:43:28

--
-- PostgreSQL database dump complete
--

