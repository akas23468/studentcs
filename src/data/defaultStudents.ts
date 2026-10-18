import { createStudentRecord } from "../lib/studentLogic";
import type { StudentRecord } from "../types/student";

export const DEFAULT_CSV_DATA = `roll_no,name,python,sql,maths
101,Aarav Sharma,92,88,95
102,Diya Patel,85,91,89
103,Rohan Verma,78,84,82
104,Ananya Iyer,95,96,98
105,Vikram Singh,88,79,91
106,Priya Nair,82,85,77
107,Aditya Joshi,90,93,87
108,Sneha Kulkarni,76,88,84
109,Rahul Mehta,89,94,90
110,Pooja Reddy,94,86,92
111,Arjun Das,81,79,85
112,Kavya Menon,87,90,88
113,Siddharth Gupta,93,95,97
114,Riya Sen,79,82,80
115,Nikhil Rao,86,88,91
116,Ishita Chatterjee,91,87,89
117,Varun Pillai,84,92,86
118,Meera Nambiar,77,81,79
119,Kunal Kapoor,96,89,94
120,Tanvi Deshmukh,83,85,88
121,Yash Malhotra,89,91,85
122,Shreya Bose,92,94,96
123,Aman Tiwari,78,86,83
124,Neha Bhatia,85,87,90
125,Harish Choudhury,90,92,89
126,Swati Saxena,68,72,65
127,Devendra Pandey,71,64,70
128,Divya Chauhan,59,68,62
129,Gaurav Mishra,74,70,67
130,Anjali Shukla,63,66,72
131,Pranav Nanda,70,73,68
132,Simran Kaur,66,61,74
133,Manish Agarwal,58,69,64
134,Radhika Bhatt,72,67,71
135,Deepak Yadav,65,74,60
136,Bhavna Jain,69,62,66
137,Tarun Goel,73,68,75
138,Kriti Grover,61,65,70
139,Sandeep Bansal,67,71,63
140,Poonam Gill,70,64,69
141,Alok Tripathi,57,63,66
142,Preeti Rastogi,64,70,72
143,Rajeshwar Thakur,72,65,68
144,Komal Varma,68,73,61
145,Chetan Rawat,60,66,74
146,Payal Somani,74,69,70
147,Bhavesh Shah,62,67,65
148,Urvashi Negi,71,75,68
149,Mohit Soni,66,60,73
150,Garima Sethi,69,72,64
151,Vivek Kaushik,48,52,45
152,Jyoti Pandey,55,49,58
153,Abhinav Mathur,42,46,50
154,Pallavi Sundaram,51,54,47
155,Rakesh Sinha,46,43,52
156,Archana Pillai,58,50,44
157,Hemant Deol,44,48,41
158,Suman Venkat,53,57,49
159,Saurabh Dube,47,41,55
160,Monali Biswas,50,53,48
161,Nitin Gokhale,43,47,51
162,Deepa Acharya,56,45,53
163,Parag Mahajan,49,52,46
164,Sonali Nayak,45,40,50
165,Sumit Rathi,52,58,43
166,Nisha Chawla,41,44,48
167,Jatin Anand,54,49,56
168,Rekha Madhavan,47,51,42
169,Ashish Shenoy,50,46,54
170,Vandana Hegde,44,53,49
171,Girish Prabhu,32,68,74
172,Seema Shenvi,78,35,62
173,Lokesh Kamat,65,70,28
174,Sunita Pai,25,58,64
175,Mahesh Bhattacharya,72,38,55
176,Aarti Mukhopadhyay,60,66,34
177,Dinesh Ganguly,36,75,80
178,Ritu Chakraborty,82,29,71
179,Sunil Ghosal,54,63,31
180,Namrata Majumdar,22,65,59
181,Pankaj Roy,67,33,76
182,Rashmi Barman,73,59,37
183,Tushar Dutta,38,71,66
184,Shilpa Dasgupta,69,27,63
185,Umesh Kundu,58,64,30
186,Madhuri Pal,35,56,68
187,Vinay Basak,64,39,72
188,Shikha Samaddar,76,61,26
189,Bharat Sarkar,28,34,62
190,Aparna Saha,31,65,24
191,Jagdish Mondal,58,22,35
192,Indira Bhowmick,24,30,36
193,Arvind Karmakar,18,29,55
194,Manju Goswami,33,52,27
195,Trilok Paul,60,25,32
196,Anita Poddar,15,20,18
197,Brijesh Malakar,37,32,45
198,Chitra Modak,26,48,31
199,Omkar Sutradhar,42,28,36
200,Lalita De,12,19,25`;

export function getDefaultStudents(): StudentRecord[] {
  const lines = DEFAULT_CSV_DATA.trim().split("\n");
  const result: StudentRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [roll_no, name, python, sql, maths] = lines[i].split(",");
    result.push(
      createStudentRecord({
        roll_no,
        name,
        python,
        sql,
        maths,
      })
    );
  }
  return result;
}
