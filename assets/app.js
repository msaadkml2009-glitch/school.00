/* Al-Noor Public School — School Management System (client-side demo)
   Data: localStorage key sms_db_v1. No server, no real backend.
   Demo passwords only — never use for production. See README.md + docs/BACKEND.md */
'use strict';
const DB_KEY='sms_db_v1', SES_KEY='sms_session_v1';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PKR=n=>'PKR '+Number(n||0).toLocaleString('en-PK');
const uid=p=>p+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
const todayStr=()=>new Date().toISOString().slice(0,10);
const fmtDate=d=>d?new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'—';
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
const GRADE=m=>m>=90?'A+':m>=80?'A':m>=70?'B':m>=60?'C':m>=50?'D':m>=40?'E':'F';
const gradePill=g=>({ 'A+':'pill-green','A':'pill-green','B':'pill-blue','C':'pill-purple','D':'pill-amber','E':'pill-amber','F':'pill-red'}[g]||'pill-grey');

/* ---------------- seed data ---------------- */
function seed(){
 const teachers=[
  {id:'T01',name:'Ayesha Khan',email:'ayesha@school.pk',subject:'Mathematics',classes:['C5A'],phone:'0301-1112233',qual:'MSc Mathematics',exp:'8 years',salary:85000,join:'2018-03-01',status:'Active'},
  {id:'T02',name:'Bilal Ahmed',email:'bilal.teacher@school.pk',subject:'English',classes:['C5A','C6A'],phone:'0302-2223344',qual:'MA English',exp:'6 years',salary:78000,join:'2020-04-15',status:'Active'},
  {id:'T03',name:'Fatima Zahra',email:'fatima@school.pk',subject:'Science',classes:['C4A','C5A'],phone:'0303-3334455',qual:'MSc Physics',exp:'10 years',salary:90000,join:'2016-02-10',status:'Active'},
  {id:'T04',name:'Hassan Raza',email:'hassan@school.pk',subject:'Urdu',classes:['C3A','C4A'],phone:'0304-4445566',qual:'MA Urdu',exp:'5 years',salary:72000,join:'2021-08-01',status:'Active'},
  {id:'T05',name:'Maryam Nawaz',email:'maryam@school.pk',subject:'Islamiyat',classes:['C1A','C2A'],phone:'0305-5556677',qual:'MA Islamiyat',exp:'7 years',salary:75000,join:'2019-01-20',status:'Active'},
  {id:'T06',name:'Usman Ghani',email:'usman@school.pk',subject:'Computer Science',classes:['C6A'],phone:'0306-6667788',qual:'BS Computer Science',exp:'4 years',salary:80000,join:'2022-03-05',status:'Active'},
  {id:'T07',name:'Sana Malik',email:'sana@school.pk',subject:'Art & Craft',classes:['KGA','NURA'],phone:'0307-7778899',qual:'BFA',exp:'3 years',salary:65000,join:'2023-01-10',status:'Active'},
  {id:'T08',name:'Omar Farooq',email:'omar@school.pk',subject:'Social Studies',classes:['C3A','C6A'],phone:'0308-8889900',qual:'MA History',exp:'9 years',salary:82000,join:'2017-09-01',status:'Active'}];
 const classes=[
  {id:'NURA',name:'Nursery',section:'A',teacherId:'T07',room:'R-01',capacity:25},
  {id:'KGA',name:'KG',section:'A',teacherId:'T07',room:'R-02',capacity:25},
  {id:'C1A',name:'Class 1',section:'A',teacherId:'T05',room:'R-03',capacity:30},
  {id:'C2A',name:'Class 2',section:'A',teacherId:'T05',room:'R-04',capacity:30},
  {id:'C3A',name:'Class 3',section:'A',teacherId:'T04',room:'R-05',capacity:30},
  {id:'C4A',name:'Class 4',section:'A',teacherId:'T03',room:'R-06',capacity:30},
  {id:'C5A',name:'Class 5',section:'A',teacherId:'T01',room:'R-07',capacity:30},
  {id:'C6A',name:'Class 6',section:'A',teacherId:'T02',room:'R-08',capacity:30}];
 const subjects=[
  {id:'SUB01',name:'Mathematics',code:'MATH'},{id:'SUB02',name:'English',code:'ENG'},{id:'SUB03',name:'Urdu',code:'URD'},
  {id:'SUB04',name:'Science',code:'SCI'},{id:'SUB05',name:'Islamiyat',code:'ISL'},{id:'SUB06',name:'Social Studies',code:'SST'},
  {id:'SUB07',name:'Computer Science',code:'CS'},{id:'SUB08',name:'Art & Craft',code:'ART'},{id:'SUB09',name:'Physical Education',code:'PE'},
  {id:'SUB10',name:'General Knowledge',code:'GK'}];
 const first=['Ahmed','Sara','Ali','Zainab','Hassan','Amina','Usman','Fatima','Bilal','Maryam','Omar','Hiba','Danish','Noor','Hamza','Iqra','Yusuf','Mahnoor','Arslan','Khadija','Saad','Ayesha','Talha','Rania'];
 const last=['Ali','Khan','Ahmed','Hussain','Malik','Raza','Shah','Butt','Chaudhry','Iqbal','Nawaz','Siddiqui','Qureshi','Anwar'];
 const students=first.map((f,i)=>{
   const cls=classes[i%8]; const parentIdx=Math.floor(i/2);
   return {id:'S'+String(i+1).padStart(2,'0'),admissionNo:'AN-2026-'+String(100+i),name:f+' '+last[i%last.length],classId:cls.id,roll:i%6+1,
   gender:i%2?'Female':'Male',dob:'201'+(i%9)+'-0'+(i%8+1)+'-1'+(i%9),blood:['A+','B+','O+','AB+'][i%4],phone:'03'+String(10+i)+'-55501'+String(i).padStart(2,'0'),
   address:(i+12)+' Street, Model Town, Lahore',parentId:'P'+String(parentIdx+1).padStart(2,'0'),status:'Active',admissionDate:'2026-04-0'+(i%8+1),medical:i===3?'Asthma — inhaler in school bag':''};});
 const parents=Array.from({length:12},(_,i)=>({id:'P'+String(i+1).padStart(2,'0'),name:['Bilal Ahmed','Shahid Khan','Nadeem Hussain','Imran Malik','Asif Raza','Khalid Shah','Tariq Butt','Farhan Chaudhry','Waqas Iqbal','Salman Nawaz','Javed Siddiqui','Rashid Qureshi'][i],email:'parent'+(i+1)+'@mail.pk',phone:'0300-77700'+String(i+10),relation:i%3===0?'Mother':'Father',children:students.filter(s=>s.parentId==='P'+String(i+1).padStart(2,'0')).map(s=>s.id)}));
 parents[0].name='Bilal Ahmed'; parents[0].email='bilal@school.pk';
 const staff=[
  {id:'ST01',name:'Nadia Hussain',role:'Accountant',dept:'Finance',phone:'0321-1002233',salary:70000,status:'Active'},
  {id:'ST02',name:'Kamran Ali',role:'Librarian',dept:'Library',phone:'0322-2003344',salary:55000,status:'Active'},
  {id:'ST03',name:'Rashid Mehmood',role:'Driver',dept:'Transport',phone:'0323-3004455',salary:45000,status:'Active'},
  {id:'ST04',name:'Shazia Bibi',role:'School Nurse',dept:'Health',phone:'0324-4005566',salary:60000,status:'Active'},
  {id:'ST05',name:'Imran Yousuf',role:'Receptionist',dept:'Admin',phone:'0325-5006677',salary:48000,status:'Active'}];
 // attendance: last 5 school days, mostly present
 const attendance=[]; const dates=[]; {const d=new Date(); let n=0; while(dates.length<5){ if(d.getDay()!==0&&d.getDay()!==6){dates.unshift(d.toISOString().slice(0,10));} d.setDate(d.getDate()-1); n++; if(n>14)break; }}
 students.forEach((s,i)=>dates.forEach((dt,di)=>{ const r=(i*7+di*3)%17; attendance.push({date:dt,studentId:s.id,classId:s.classId,status:r===0?'Absent':r===1?'Late':r===2?'Leave':'Present'}); }));
 const timetable=[]; const slots=[['08:00','Mathematics','T01'],['08:45','English','T02'],['09:30','Science','T03'],['10:15','Urdu','T04'],['11:00','Islamiyat','T05'],['11:45','Computer Science','T06']];
 classes.forEach(c=>DAYS.forEach((day,di)=>slots.forEach((sl,pi)=>{ if((di+pi)%7===6) return; timetable.push({classId:c.id,day,period:pi+1,time:sl[0],subject:sl[1],teacherId:sl[2],room:c.room}); })));
 const exams=[{id:'EX01',name:'Midterm Examination 2026',term:'Term 1',start:'2026-10-12',end:'2026-10-20',status:'Published'}];
 const marks=[]; students.forEach((s,i)=>['Mathematics','English','Science','Urdu'].forEach((sub,si)=>{ marks.push({examId:'EX01',studentId:s.id,subject:sub,obtained:62+((i*13+si*7)%36),total:100}); }));
 const fees=[]; students.forEach((s,i)=>{ const amt=8000+(i%3)*1500; const paid=i%4!==0; fees.push({id:'INV-'+(2000+i),studentId:s.id,month:'November 2026',amount:amt,paid:paid?amt:0,due:'2026-11-10',discount:i%5===0?1000:0,status:paid?'Paid':(i%4===1?'Overdue':'Pending')}); });
 const payments=fees.filter(f=>f.paid>0).slice(0,14).map((f,i)=>({receipt:'RCP-2026-'+String(1001+i),invoiceId:f.id,studentId:f.studentId,amount:f.paid,date:'2026-11-0'+(i%7+1),method:['Cash','Bank Transfer','JazzCash'][i%3],receivedBy:'Nadia Hussain'}));
 const homework=[
  {id:'HW01',title:'Maths Exercise 5.2 — Fractions',subject:'Mathematics',classId:'C5A',teacherId:'T01',due:dates[0],desc:'Solve questions 1–10 from Exercise 5.2 in your notebook.',status:'Open'},
  {id:'HW02',title:'English Essay — My Favourite Book',subject:'English',classId:'C5A',teacherId:'T02',due:dates[1],desc:'Write a 150-word essay. Check spelling and punctuation.',status:'Open'},
  {id:'HW03',title:'Science Worksheet — Plants',subject:'Science',classId:'C4A',teacherId:'T03',due:dates[0],desc:'Label the parts of a plant and write two sentences about each.',status:'Open'}];
 const assignments=[
  {id:'AS01',title:'Maths Project — Shapes Around Us',subject:'Mathematics',classId:'C5A',teacherId:'T01',due:'2026-11-20',desc:'Make a chart of 10 shapes found at home with photos or drawings.',total:20,submissions:[{studentId:'S01',file:'shapes-ahmed.pdf',grade:18,feedback:'Excellent work, Ahmed!'}]},
  {id:'AS02',title:'English Reading Assignment',subject:'English',classId:'C5A',teacherId:'T02',due:'2026-11-18',desc:'Read Chapter 4 and answer the 5 questions.',total:10,submissions:[]}];
 const books=Array.from({length:20},(_,i)=>({id:'BK'+String(i+1).padStart(2,'0'),title:['Mathematics Grade 5','English Reader 5','Urdu Qaida','Science Explorer','Islamiyat Book','Social Studies 6','Computer Basics','Story Book — Tales of Lahore','General Knowledge','Art & Craft Guide','English Grammar','Maths Workbook','Science Lab Manual','History of Pakistan','Geography Atlas','Poetry Collection','Dictionary — English/Urdu','Physics Basics','Chemistry Fun','Biology for Kids'][i],author:['A. Rahman','S. Iqbal','M. Aslam','Dr. K. Ahmed','F. Bibi','H. Raza','U. Ghani','N. Akhtar','T. Aziz','S. Malik','B. Ali','R. Khan','L. Shah','O. Farooq','Z. Ahmed','M. Nawaz','A. Khan','S. Zahra','I. Malik','W. Hussain'][i],isbn:'978-969-00'+String(100+i),copies:3+(i%4),issued:i%5===0?1:0,category:['Maths','English','Urdu','Science','Islamiyat','Social Studies','Computer','Stories','General','Art'][i%10]}));
 const issues=[{id:'IS01',bookId:'BK01',studentId:'S01',issueDate:dates[2],dueDate:dates[0],returned:false},{id:'IS02',bookId:'BK04',studentId:'S02',issueDate:dates[3],dueDate:dates[1],returned:false}];
 const buses=[
  {id:'BUS01',no:'LES-101',route:'Model Town — Gulberg',driver:'Rashid Mehmood',capacity:30,students:8},
  {id:'BUS02',no:'LES-102',route:'Johar Town — Township',driver:'Aslam Khan',capacity:28,students:6},
  {id:'BUS03',no:'LES-103',route:'Cantt — DHA',driver:'Naseer Ahmed',capacity:32,students:7}];
 return {
  school:{name:'Al-Noor Public School',motto:'Knowledge • Character • Excellence',address:'12-B Main Boulevard, Model Town, Lahore, Pakistan',phone:'042-35851234',email:'info@alnoor.edu.pk',website:'www.alnoor.edu.pk',academicYear:'2026–27',currency:'PKR',language:'English',branches:['Main Campus — Model Town']},
  users:[
   {id:'U01',name:'Admin',email:'admin@school.pk',password:'admin123',role:'admin',title:'School Administrator'},
   {id:'U02',name:'Ayesha Khan',email:'ayesha@school.pk',password:'teacher123',role:'teacher',teacherId:'T01',title:'Maths Teacher — Class 5-A'},
   {id:'U03',name:'Ahmed Ali',email:'ahmed@school.pk',password:'student123',role:'student',studentId:'S01',title:'Class 5-A • Roll 1'},
   {id:'U04',name:'Bilal Ahmed',email:'bilal@school.pk',password:'parent123',role:'parent',parentId:'P01',title:'Father of Ahmed Ali & Sara Ali'}],
  teachers,classes,subjects,students,parents,staff,attendance,timetable,exams,marks,fees,payments,homework,assignments,books,issues,buses,
  admissions:[
   {id:'AD01',name:'Zara Fatima',cls:'Class 1',status:'Applied',date:'2026-11-18',phone:'0309-1112233',guardian:'Hassan Fatima'},
   {id:'AD02',name:'Ali Raza',cls:'Nursery',status:'Under Review',date:'2026-11-17',phone:'0309-2223344',guardian:'Raza Ahmed'},
   {id:'AD03',name:'Hira Shah',cls:'Class 3',status:'Test Scheduled',date:'2026-11-16',phone:'0309-3334455',guardian:'Shahid Shah'},
   {id:'AD04',name:'Bilal Hussain',cls:'KG',status:'Approved',date:'2026-11-15',phone:'0309-4445566',guardian:'Hussain Ali'},
   {id:'AD05',name:'Areeba Khan',cls:'Class 2',status:'Inquiry',date:'2026-11-19',phone:'0309-5556677',guardian:'Khan Muhammad'}],
  announcements:[
   {id:'AN01',title:'Midterm results published',body:'Midterm Examination 2026 results are now available in the Student and Parent portals.',date:'2026-11-20',audience:'All',pinned:true},
   {id:'AN02',title:'Parent–Teacher Meeting — 28 November',body:'All parents are invited to meet class teachers between 9:00 AM and 1:00 PM.',date:'2026-11-18',audience:'Parents',pinned:true},
   {id:'AN03',title:'Sports Day — 5 December',body:'Annual Sports Day will be held at the school ground. Students should wear their sports uniform.',date:'2026-11-15',audience:'All',pinned:false}],
  messages:[
   {id:'M01',from:'Ayesha Khan',to:'Bilal Ahmed',subject:'Ahmed — excellent in Maths',body:'Ahmed scored 92 in the Midterm Maths paper. Please encourage him to keep it up.',date:'2026-11-20',read:false,role:'teacher'},
   {id:'M02',from:'Admin',to:'All Teachers',subject:'Staff meeting on Monday',body:'Staff meeting at 8:00 AM in the staff room to discuss the annual function.',date:'2026-11-19',read:true,role:'admin'}],
  events:[
   {id:'EV01',title:'Parent–Teacher Meeting',date:'2026-11-28',type:'Meeting',desc:'Meet class teachers 9 AM–1 PM.'},
   {id:'EV02',title:'Annual Sports Day',date:'2026-12-05',type:'Sports',desc:'School ground, sports uniform required.'},
   {id:'EV03',title:'Science Exhibition',date:'2026-12-12',type:'Academic',desc:'Classes 4–6 present science projects.'},
   {id:'EV04',title:'Winter Holidays Begin',date:'2026-12-22',type:'Holiday',desc:'School closes for winter break.'}],
  discipline:[{id:'D01',studentId:'S05',type:'Positive',note:'Helped a new student settle in Class 3.',date:'2026-11-14',by:'Hassan Raza'}],
  health:[{id:'H01',studentId:'S04',note:'Asthma — inhaler kept with class teacher. (Restricted: nurse & admin only.)',date:'2026-11-10',by:'Shazia Bibi'}],
  inventory:[
   {id:'INV01',item:'Student desks',category:'Furniture',qty:120,location:'Classrooms'},
   {id:'INV02',item:'Desktop computers',category:'IT Equipment',qty:25,location:'Computer Lab'},
   {id:'INV03',item:'Science lab kits',category:'Laboratory',qty:15,location:'Science Lab'},
   {id:'INV04',item:'Footballs',category:'Sports',qty:20,location:'Sports Room'}],
  canteen:[
   {id:'C01',item:'Chicken Biryani',price:150,category:'Lunch'},{id:'C02',item:'Zinger Burger',price:220,category:'Fast Food'},
   {id:'C03',item:'Fresh Juice',price:80,category:'Drinks'},{id:'C04',item:'Samosa',price:40,category:'Snacks'}],
  ledger:[
   {id:'L01',date:'2026-11-03',type:'Income',category:'Fee Collection',desc:'November fee collection',amount:145000},
   {id:'L02',date:'2026-11-05',type:'Expense',category:'Utilities',desc:'Electricity bill — October',amount:42000},
   {id:'L03',date:'2026-11-08',type:'Expense',category:'Salaries',desc:'Staff advance',amount:30000},
   {id:'L04',date:'2026-11-12',type:'Income',category:'Admission Fee',desc:'New admissions',amount:25000}],
  leaves:[
   {id:'LV01',name:'Fatima Zahra',role:'Teacher',from:'2026-11-25',to:'2026-11-26',reason:'Family function',status:'Pending'},
   {id:'LV02',name:'Hassan Raza',role:'Teacher',from:'2026-11-18',to:'2026-11-18',reason:'Medical',status:'Approved'}],
  meetings:[
   {id:'MT01',parent:'Bilal Ahmed',teacher:'Ayesha Khan',date:'2026-11-28',time:'10:00 AM',topic:'Ahmed — Midterm progress',status:'Scheduled'}],
  feeStructure:[{cls:'Nursery / KG',monthly:6000,admission:10000},{cls:'Class 1–3',monthly:7500,admission:12000},{cls:'Class 4–6',monthly:9000,admission:15000}],
  settings:{grading:'A+ to F (40% pass)',attendanceRule:'75% minimum to sit exams',workingDays:'Monday – Friday',timings:'8:00 AM – 2:30 PM'},
  audit:[{id:'A01',action:'Admin logged in',by:'Admin',date:'2026-11-20 09:02'},{id:'A02',action:'Midterm results published',by:'Ayesha Khan',date:'2026-11-20 11:30'}]
 };
}
let DB=load();
function load(){ try{const r=localStorage.getItem(DB_KEY); if(r) return JSON.parse(r);}catch(e){} const s=seed(); try{localStorage.setItem(DB_KEY,JSON.stringify(s));}catch(e){} return s; }
function save(){ try{localStorage.setItem(DB_KEY,JSON.stringify(DB));}catch(e){ toast('Could not save — browser storage is full or blocked.','err'); } }
function resetDemo(){ if(confirm('Reset all demo data? Your changes will be lost.')){ localStorage.removeItem(DB_KEY); DB=seed(); save(); location.reload(); } }
function audit(action){ DB.audit.unshift({id:uid('A'),action,by:currentUser()?.name||'System',date:new Date().toLocaleString('en-GB')}); save(); }

/* ---------------- session / helpers ---------------- */
function currentUser(){ try{const s=JSON.parse(localStorage.getItem(SES_KEY)||'null'); return s?DB.users.find(u=>u.id===s.id)||null:null;}catch(e){return null;} }
function login(email,pw,remember){ const u=DB.users.find(x=>x.email.toLowerCase()===String(email).toLowerCase().trim()&&x.password===pw); if(!u) return null; localStorage.setItem(SES_KEY,JSON.stringify({id:u.id,remember:!!remember})); audit(u.name+' logged in'); return u; }
function logout(){ localStorage.removeItem(SES_KEY); route='dashboard'; routeParam=null; render(); }
function studentById(id){return DB.students.find(s=>s.id===id);}
function classById(id){return DB.classes.find(c=>c.id===id);}
function teacherById(id){return DB.teachers.find(t=>t.id===id);}
function parentById(id){return DB.parents.find(p=>p.id===id);}
function classLabel(id){const c=classById(id); return c?c.name+'-'+c.section:'—';}
function myStudents(){ const u=currentUser(); if(!u) return []; if(u.role==='parent'){const p=parentById(u.parentId); return (p?p.children:[]).map(studentById).filter(Boolean);} if(u.role==='student') return [studentById(u.studentId)].filter(Boolean); return DB.students; }
function myClasses(){ const u=currentUser(); if(u.role==='teacher'){const t=teacherById(u.teacherId); return DB.classes.filter(c=>t&&t.classes.includes(c.id));} if(u.role==='student'){const s=studentById(u.studentId); return s?[classById(s.classId)]:[];} if(u.role==='parent'){return myStudents().map(s=>classById(s.classId)).filter(Boolean);} return DB.classes; }
function attPct(sid){ const rows=DB.attendance.filter(a=>a.studentId===sid); if(!rows.length) return 100; const p=rows.filter(a=>a.status==='Present'||a.status==='Late').length; return Math.round(p/rows.length*100); }
function studentFees(sid){ return DB.fees.filter(f=>f.studentId===sid); }
function feeBalance(sid){ return studentFees(sid).reduce((a,f)=>a+(f.amount-f.paid-(f.discount||0)),0); }
function studentAvg(sid){ const m=DB.marks.filter(x=>x.studentId===sid); if(!m.length) return null; return Math.round(m.reduce((a,x)=>a+x.obtained/x.total*100,0)/m.length); }
function toast(msg,type){ const t=document.createElement('div'); t.className='toast '+(type||'ok'); t.textContent=msg; $('#toast-root').appendChild(t); setTimeout(()=>t.remove(),3600); }
function confirmDlg(msg,onYes){ openModal('Please confirm',`<p>${esc(msg)}</p>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Yes, continue',cls:'btn-primary',fn:onYes}]); }
function openModal(title,bodyHtml,actions){ const r=$('#modal-root'); r.innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><div class="modal" role="dialog" aria-modal="true"><h2>${esc(title)}</h2><div style="margin-top:10px">${bodyHtml}</div><div class="actions"></div></div></div>`; const box=r.querySelector('.actions'); (actions||[{label:'Close',cls:'btn-primary'}]).forEach(a=>{ const b=document.createElement('button'); b.className='btn '+(a.cls||'btn-ghost'); b.textContent=a.label; b.onclick=()=>{ const r=a.fn?a.fn():undefined; if(r!==false) closeModal(); }; box.appendChild(b); }); }
function closeModal(){ $('#modal-root').innerHTML=''; }
function exportCSV(filename,rows){ const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=filename; a.click(); toast('Exported '+filename); }
function printSection(html,title){ const w=window.open('','_blank'); w.document.write(`<html><head><title>${esc(title||'Document')}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body>${html}</body></html>`); w.document.close(); w.focus(); setTimeout(()=>w.print(),300); }

/* ---------------- i18n ---------------- */
const I18N={en:{dashboard:'Dashboard',students:'Students',teachers:'Teachers',attendance:'Attendance',fees:'Fees & Finance',timetable:'Timetable',homework:'Homework',assignments:'Assignments',exams:'Examinations',results:'Results',library:'Library',transport:'Transport',messages:'Messages',events:'Events',settings:'Settings',logout:'Log out',search:'Search students, teachers…',welcome:'Welcome back'},ur:{dashboard:'ڈیش بورڈ',students:'طلبہ',teachers:'اساتذہ',attendance:'حاضری',fees:'فیس و مالیات',timetable:'ٹائم ٹیبل',homework:'ہوم ورک',assignments:'اسائنمنٹس',exams:'امتحانات',results:'نتائج',library:'لائبریری',transport:'ٹرانسپورٹ',messages:'پیغامات',events:'تقریبات',settings:'ترتیبات',logout:'لاگ آؤٹ',search:'طلبہ، اساتذہ تلاش کریں…',welcome:'خوش آمدید'}};
let LANG=localStorage.getItem('sms_lang')||'en';
const t=k=>(I18N[LANG]&&I18N[LANG][k])||I18N.en[k]||k;
function setLang(l){ LANG=l; localStorage.setItem('sms_lang',l); document.documentElement.lang=l; document.documentElement.dir=l==='ur'?'rtl':'ltr'; render(); }
function toggleTheme(){ document.body.classList.toggle('dark'); localStorage.setItem('sms_theme',document.body.classList.contains('dark')?'dark':'light'); }

/* ---------------- login ---------------- */
function renderLogin(err){
 const demo=[['admin@school.pk','admin123','👩‍💼','Admin Portal','Full control — students, fees, staff, reports.'],['ayesha@school.pk','teacher123','👩‍🏫','Teacher Portal','Ayesha Khan — Class 5-A, Mathematics.'],['ahmed@school.pk','student123','🧑‍🎓','Student Portal','Ahmed Ali — Class 5-A, Roll 1.'],['bilal@school.pk','parent123','👨‍👩‍👧','Parent Portal','Bilal Ahmed — father of Ahmed & Sara.']];
 $('#app').innerHTML=`<div class="login-wrap"><div class="login-card">
  <div class="login-hero"><span class="badge">🏫 Al-Noor Public School • Lahore</span>
   <h1>School Management System</h1><p>One platform for the whole school — admin, teachers, students and parents. Demo data is stored only in your browser.</p>
   <div class="portal-list">${demo.map(d=>`<div class="portal-item"><span class="pi">${d[2]}</span><div><b>${d[3]}</b><span>${d[4]}</span></div></div>`).join('')}</div>
   <p style="margin-top:auto;font-size:.85rem">🇵🇰 PKR • English / اردو • Classes Playgroup – 10 • Matric &amp; Intermediate ready</p></div>
  <form class="login-form" id="login-form"><h2>Sign in</h2><p class="muted">Use a demo account below, or sign in with email and password.</p>
   ${err?`<div class="error-box">${esc(err)}</div>`:''}
   <div class="field"><label for="email">Email</label><input id="email" type="email" required placeholder="you@school.pk" autocomplete="username"></div>
   <div class="field"><label for="pwd">Password</label><input id="pwd" type="password" required placeholder="••••••••" autocomplete="current-password"></div>
   <div class="field" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="rem" style="width:auto"><label for="rem" style="margin:0;font-weight:400">Remember me</label><a href="#" style="margin-left:auto" onclick="event.preventDefault();toast('Demo only: use a demo account below. Password reset needs email configured — see README.','err')">Forgot password?</a></div>
   <button class="btn btn-primary btn-block" type="submit">Sign in →</button>
   <h3 style="margin:20px 0 4px">One-click demo login</h3><p class="hint">Development only — these accounts are for testing, not production.</p>
   <div class="demo-grid">${demo.map(d=>`<button type="button" class="demo-card" onclick="demoLogin('${d[0]}','${d[1]}')"><b>${d[2]} ${d[3]}</b><span>${d[4].split('—')[0]}</span><br><code>${d[0]} / ${d[1]}</code></button>`).join('')}</div>
   <p class="hint" style="margin-top:16px">SMS, WhatsApp, email and payment gateways are integration-ready only — they need configuration and are never faked. See README.md.</p>
  </form></div></div>`;
 $('#login-form').onsubmit=e=>{ e.preventDefault(); const u=login($('#email').value,$('#pwd').value,$('#rem').checked); if(!u){ renderLogin('Incorrect email or password. Try a demo account below.'); return; } route='dashboard'; routeParam=null; render(); };
}
function demoLogin(e,p){ const u=login(e,p,true); if(u){ route='dashboard'; routeParam=null; toast('Welcome, '+u.name+' 👋'); render(); } else renderLogin('Demo login failed.'); }

/* ---------------- shell / navigation ---------------- */
const NAV={
 admin:[['sec','School'],['dashboard','📊','Dashboard'],['students','🧑‍🎓','Students'],['admissions','📝','Admissions'],['teachers','👩‍🏫','Teachers'],['staff','💼','Staff & HR'],['academics','🏫','Academics'],['attendance','✅','Attendance'],['timetable','🗓️','Timetable'],['exams','📋','Examinations'],['fees','💰','Fees & Finance'],['accounting','📒','Accounting'],['homework','📚','Homework'],['assignments','📄','Assignments'],['library','📖','Library'],['transport','🚌','Transport'],['communication','💬','Communication'],['events','🎉','Events & Calendar'],['discipline','⚖️','Discipline'],['health','🩺','Health'],['inventory','📦','Inventory'],['canteen','🍽️','Canteen'],['reports','📈','Reports & Analytics'],['users','🔐','Users & Permissions'],['settings','⚙️','Settings']],
 teacher:[['sec','Teacher'],['dashboard','📊','Dashboard'],['classes','🏫','My Classes'],['attendance','✅','Attendance'],['timetable','🗓️','Timetable'],['homework','📚','Homework'],['assignments','📄','Assignments'],['exams','📋','Exams & Marks'],['progress','📈','Student Progress'],['messages','💬','Messages'],['leave','🌿','Leave'],['profile','👤','Profile']],
 student:[['sec','Student'],['dashboard','📊','Dashboard'],['profile','👤','My Profile'],['attendance','✅','Attendance'],['timetable','🗓️','Timetable'],['homework','📚','Homework'],['assignments','📄','Assignments'],['exams','📋','Exams & Results'],['fees','💰','Fees'],['library','📖','Library'],['events','🎉','Events'],['messages','💬','Messages'],['documents','🪪','Documents']],
 parent:[['sec','Parent'],['dashboard','📊','Dashboard'],['children','👨‍👩‍👧','My Children'],['attendance','✅','Attendance'],['progress','📈','Academic Progress'],['homework','📚','Homework & Assignments'],['fees','💰','Fees & Payments'],['timetable','🗓️','Timetable'],['messages','💬','Messages'],['meetings','🤝','Parent Meetings'],['transport','🚌','Transport'],['events','🎉','Events'],['documents','🪪','Documents'],['profile','👤','Profile']]};
let route='dashboard', routeParam=null, childSel=null;
function go(r,p){ route=r; routeParam=p||null; $('.sidebar')?.classList.remove('open'); render(); document.documentElement.scrollTop=0; document.body.scrollTop=0; }
function statCard(ic,cls,num,label,sub){ return `<div class="card lift stat"><div class="ic ${cls}">${ic}</div><div><div class="num">${num}</div><div class="lbl">${label}</div>${sub?`<div class="sub">${sub}</div>`:''}</div></div>`; }
function barRow(label,pct,val,cls){ return `<div class="bar-row"><span>${esc(label)}</span><div class="bar-track"><div class="bar-fill ${cls||''}" style="width:${Math.min(100,Math.max(0,pct))}%"></div></div><span style="text-align:right;font-weight:600">${val}</span></div>`; }
function pill(txt,cls){ return `<span class="pill ${cls}">${esc(txt)}</span>`; }
function statusPill(s){ return pill(s,{Present:'pill-green',Paid:'pill-green',Active:'pill-green',Approved:'pill-green',Admitted:'pill-green',Absent:'pill-red',Overdue:'pill-red',Rejected:'pill-red',Pending:'pill-amber',Late:'pill-amber','Under Review':'pill-amber','Test Scheduled':'pill-blue',Applied:'pill-blue',Inquiry:'pill-grey',Open:'pill-blue',Scheduled:'pill-blue',Returned:'pill-green'}[s]||'pill-grey'); }

function render(){
 if(localStorage.getItem('sms_theme')==='dark') document.body.classList.add('dark');
 const u=currentUser();
 if(!u){ renderLogin(); return; }
 const nav=NAV[u.role]||NAV.admin;
 const title=(nav.find(n=>n[0]===route)||[])[2]||'Dashboard';
 const unread=DB.messages.filter(m=>!m.read).length;
 const notifs=notificationsFor(u);
 $('#app').innerHTML=`<div class="shell">
  <aside class="sidebar" id="sidebar"><div class="brand"><div class="logo">🏫</div><div><b>${esc(DB.school.name)}</b><span>${esc(u.title||u.role)} • ${esc(DB.school.academicYear)}</span></div></div>
   <nav class="nav">${nav.map(n=>n[0]==='sec'?`<div class="nav-sec">${n[1]}</div>`:`<button class="nav-item ${route===n[0]?'active':''}" onclick="go('${n[0]}')"><span class="ni">${n[1]}</span>${n[2]}${n[0]==='messages'&&unread?`<span class="cnt">${unread}</span>`:''}</button>`).join('')}</nav>
   <div class="side-foot">PKR • English / اردو<br>Demo data — local only<br><button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="resetDemo()">↺ Reset demo data</button></div></aside>
  <div class="main"><header class="topbar">
   <button class="icon-btn menu-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')" aria-label="Menu">☰</button>
   <h1>${esc(title)}</h1>
   <div class="search-box"><span class="s-ic">🔍</span><input id="global-search" placeholder="${esc(t('search'))}" onkeydown="if(event.key==='Enter'){go('students');setTimeout(()=>{const i=document.getElementById('tbl-q');if(i){i.value=this.value;i.dispatchEvent(new Event('input'));}},50);}"></div>
   <div class="top-actions">
    <button class="icon-btn" title="Notifications" onclick="showNotifications()">🔔${notifs.length?` <span class="pill pill-amber" style="margin-left:2px">${notifs.length}</span>`:''}</button>
    <button class="icon-btn" title="Language: English / اردو" onclick="setLang(LANG==='en'?'ur':'en')">🌐 ${LANG==='en'?'اردو':'EN'}</button>
    <button class="icon-btn" title="Dark / light mode" onclick="toggleTheme();render()">🌙</button>
    <div class="avatar" title="${esc(u.name)}">${esc(u.name.split(' ').map(w=>w[0]).slice(0,2).join(''))}</div>
    <button class="btn btn-ghost btn-sm" onclick="logout()">${esc(t('logout'))}</button>
   </div></header>
   <main class="content" id="view"></main></div></div>
  <nav class="mob-nav">${nav.filter(n=>n[0]!=='sec').slice(0,5).map(n=>`<button class="${route===n[0]?'active':''}" onclick="go('${n[0]}')"><span class="mi">${n[1]}</span>${n[2].split(' ')[0]}</button>`).join('')}</nav>`;
 renderView(u);
}
function notificationsFor(u){
 const n=[];
 DB.fees.filter(f=>f.status==='Overdue').slice(0,3).forEach(f=>{ const s=studentById(f.studentId); n.push(`💰 Fee overdue: ${s?s.name:''} — ${PKR(f.amount-f.paid)}`); });
 const td=todayStr(); DB.attendance.filter(a=>a.date===td&&a.status==='Absent').slice(0,3).forEach(a=>{ const s=studentById(a.studentId); n.push(`⚠️ Absent today: ${s?s.name:''} (${classLabel(a.classId)})`); });
 DB.homework.filter(h=>h.status==='Open').slice(0,2).forEach(h=>n.push(`📚 Homework due ${fmtDate(h.due)}: ${h.title}`));
 DB.announcements.filter(a=>a.pinned).forEach(a=>n.push(`📢 ${a.title}`));
 return n;
}
function showNotifications(){ const u=currentUser(); const n=notificationsFor(u); openModal('Notifications', n.length?`<ul style="padding-left:18px">${n.map(x=>`<li style="margin-bottom:8px">${esc(x)}</li>`).join('')}</ul>`:'<p>No new notifications.</p><p class="muted">Email, SMS and WhatsApp alerts are integration-ready — they need configuration in Settings. See README.</p>',[{label:'Close',cls:'btn-primary'}]); }
function crumb(extra){ return `<div class="crumb">🏫 ${esc(DB.school.name)} &nbsp;›&nbsp; <b>${esc(extra||'Dashboard')}</b></div>`; }
function emptyState(icon,msg,btn){ return `<div class="empty"><span class="big">${icon}</span><p>${esc(msg)}</p>${btn||''}</div>`; }

/* ---------------- dashboards ---------------- */
function renderView(u){
 const v=$('#view'); if(!v) return;
 const map={dashboard:()=>viewDashboard(u),students:viewStudents,admissions:viewAdmissions,teachers:viewTeachers,staff:viewStaff,academics:viewAcademics,attendance:()=>viewAttendance(u),timetable:()=>viewTimetable(u),exams:()=>viewExams(u),fees:()=>viewFees(u),accounting:viewAccounting,homework:()=>viewHomework(u),assignments:()=>viewAssignments(u),library:()=>viewLibrary(u),transport:viewTransport,communication:viewCommunication,events:viewEvents,discipline:viewDiscipline,health:viewHealth,inventory:viewInventory,canteen:viewCanteen,reports:viewReports,users:viewUsers,settings:viewSettings,classes:()=>viewMyClasses(u),progress:()=>viewProgress(u),messages:()=>viewMessages(u),leave:viewLeave,profile:()=>viewProfile(u),children:()=>viewChildren(u),meetings:viewMeetings,documents:()=>viewDocuments(u)};
 (map[route]||(()=>viewDashboard(u)))();
}
function viewDashboard(u){
 const v=$('#view'); const td=todayStr();
 const attToday=DB.attendance.filter(a=>a.date===td);
 const present=attToday.filter(a=>a.status==='Present'||a.status==='Late').length;
 const absent=attToday.filter(a=>a.status==='Absent').length;
 const collected=DB.payments.reduce((a,p)=>a+p.amount,0);
 const outstanding=DB.fees.reduce((a,f)=>a+(f.amount-f.paid-(f.discount||0)),0);
 const pendingHW=DB.homework.filter(h=>h.status==='Open').length;
 const head=`${crumb('Dashboard')}<div class="page-head"><div><h1>${esc(t('welcome'))}, ${esc(u.name.split(' ')[0])} 👋</h1><p>${fmtDate(td)} • ${esc(DB.school.academicYear)} • ${esc(DB.school.name)}, Lahore</p></div>
  <div class="quick-actions"><button class="btn btn-primary" onclick="go('attendance')">✅ Mark attendance</button><button class="btn btn-ghost" onclick="go('fees')">💰 Record payment</button><button class="btn btn-ghost" onclick="go('students')">🔍 Find a student</button></div></div>`;
 if(u.role==='admin'){
  v.innerHTML=head+`<div class="grid g4">
   ${statCard('🧑‍🎓','ic-blue',DB.students.length,'Total students',DB.classes.length+' classes • '+DB.students.filter(s=>s.status==='Active').length+' active')}
   ${statCard('👩‍🏫','ic-purple',DB.teachers.length,'Total teachers',DB.staff.length+' staff members')}
   ${statCard('✅','ic-green',attToday.length?Math.round(present/Math.max(1,attToday.length)*100)+'%':'—',"Today's attendance",present+' present • '+absent+' absent')}
   ${statCard('💰','ic-amber',PKR(collected),'Fee collected (Nov)',PKR(outstanding)+' outstanding')}</div>
  <div class="grid g2" style="margin-top:16px">
   <section class="card tint-grey"><h3><span class="ci">📊</span>Attendance this week</h3>${[...new Set(DB.attendance.map(a=>a.date))].slice(-5).map(d=>{ const rows=DB.attendance.filter(a=>a.date===d); const p=rows.filter(a=>a.status==='Present'||a.status==='Late').length; return barRow(fmtDate(d),Math.round(p/Math.max(1,rows.length)*100),Math.round(p/Math.max(1,rows.length)*100)+'%','green'); }).join('')||emptyState('✅','No attendance recorded yet.')}</section>
   <section class="card tint-pink"><h3><span class="ci">💰</span>Fee collection by class</h3>${DB.classes.slice(0,5).map(c=>{ const ss=DB.students.filter(s=>s.classId===c.id); const tot=DB.fees.filter(f=>ss.some(s=>s.id===f.studentId)).reduce((a,f)=>a+f.paid,0); return barRow(c.name,Math.min(100,tot/400),PKR(tot)); }).join('')}</section>
   <section class="card"><h3><span class="ci">📢</span>Announcements</h3>${DB.announcements.slice(0,3).map(a=>`<p><b>${esc(a.title)}</b><br><small>${esc(a.body)}</small></p>`).join('')}</section>
   <section class="card"><h3><span class="ci">⚡</span>Needs attention today</h3><p>⏰ <b>${DB.fees.filter(f=>f.status==='Overdue').length}</b> overdue fee invoices — <a href="#" onclick="event.preventDefault();go('fees')">review fees</a></p><p>📝 <b>${DB.admissions.filter(a=>a.status!=='Admitted'&&a.status!=='Rejected').length}</b> open admission applications — <a href="#" onclick="event.preventDefault();go('admissions')">review admissions</a></p><p>📚 <b>${pendingHW}</b> open homework tasks — <a href="#" onclick="event.preventDefault();go('homework')">view homework</a></p><p>📖 <b>${DB.issues.filter(i=>!i.returned).length}</b> books currently issued</p></section>
  </div>`;
 } else if(u.role==='teacher'){
  const t=teacherById(u.teacherId); const myCls=t?t.classes:[];
  const tt=DB.timetable.filter(x=>x.teacherId===u.teacherId&&x.day===['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]);
  v.innerHTML=head+`<div class="grid g4">${statCard('🏫','ic-blue',myCls.length,'My classes',myCls.map(classLabel).join(', '))}${statCard('🧑‍🎓','ic-purple',DB.students.filter(s=>myCls.includes(s.classId)).length,'My students','Across assigned classes')}${statCard('🗓️','ic-green',tt.length,'Periods today',tt.length?tt[0].time+' onwards':'No periods today')}${statCard('📚','ic-amber',DB.homework.filter(h=>h.teacherId===u.teacherId).length,'Homework set','Pending submissions to review')}</div>
  <div class="grid g2" style="margin-top:16px"><section class="card"><h3><span class="ci">🗓️</span>Today's timetable</h3>${tt.length?tt.map(x=>`<p><b>${esc(x.time)}</b> — ${esc(x.subject)} • ${classLabel(x.classId)} • Room ${esc(x.room)}</p>`).join(''):emptyState('🗓️','No periods today.')}</section>
  <section class="card"><h3><span class="ci">⚡</span>Quick actions</h3><div class="quick-actions"><button class="btn btn-primary" onclick="go('attendance')">✅ Mark attendance</button><button class="btn btn-ghost" onclick="go('homework')">📚 New homework</button><button class="btn btn-ghost" onclick="go('exams')">📋 Enter marks</button></div><p class="muted" style="margin-top:12px">Your classes: ${myCls.map(classLabel).join(', ')||'—'}</p></section></div>`;
 } else if(u.role==='student'){
  const s=studentById(u.studentId); const avg=studentAvg(s.id);
  v.innerHTML=head+`<div class="grid g4">${statCard('✅','ic-green',attPct(s.id)+'%','My attendance','This term, all subjects')}${statCard('📋','ic-purple',avg===null?'—':avg+'%','Midterm average',avg===null?'':GRADE(avg)+' grade')}${statCard('💰','ic-amber',PKR(feeBalance(s.id)),'Fee balance',feeBalance(s.id)===0?'All fees paid 🎉':'Due 10 Nov 2026')}${statCard('📚','ic-blue',DB.homework.filter(h=>h.classId===s.classId).length,'Homework assigned','Check due dates below')}</div>
  <div class="grid g2" style="margin-top:16px"><section class="card"><h3><span class="ci">📚</span>Homework — ${classLabel(s.classId)}</h3>${DB.homework.filter(h=>h.classId===s.classId).map(h=>`<p><b>${esc(h.title)}</b> — ${esc(h.subject)}<br><small>Due ${fmtDate(h.due)} • ${esc(h.desc)}</small></p>`).join('')||emptyState('📚','No homework right now.')}</section>
  <section class="card"><h3><span class="ci">🗓️</span>Today's timetable</h3>${DB.timetable.filter(x=>x.classId===s.classId).slice(0,6).map(x=>`<p><b>${esc(x.time)}</b> — ${esc(x.subject)} • ${esc((teacherById(x.teacherId)||{}).name||'')}</p>`).join('')}</section></div>`;
 } else {
  const kids=myStudents(); const sel=childSel||kids[0]?.id; const s=studentById(sel)||kids[0];
  v.innerHTML=head+`<div class="child-switch">${kids.map(k=>`<button class="${s&&k.id===s.id?'active':''}" onclick="childSel='${k.id}';render()"><b>${esc(k.name)}</b><br><small>${classLabel(k.classId)} • Roll ${k.roll}</small></button>`).join('')}</div>`+
  (s?`<div class="grid g4">${statCard('✅','ic-green',attPct(s.id)+'%','Attendance',s.name)}${statCard('📋','ic-purple',(studentAvg(s.id)??'—')+'%','Midterm average','')}${statCard('💰','ic-amber',PKR(feeBalance(s.id)),'Fee balance','')}${statCard('🚌','ic-blue','Bus 1','Model Town — Gulberg','Driver: Rashid Mehmood')}</div>
  <div class="grid g2" style="margin-top:16px"><section class="card"><h3><span class="ci">📢</span>Announcements</h3>${DB.announcements.slice(0,3).map(a=>`<p><b>${esc(a.title)}</b><br><small>${esc(a.body)}</small></p>`).join('')}</section><section class="card"><h3><span class="ci">📚</span>Homework for ${esc(s.name)}</h3>${DB.homework.filter(h=>h.classId===s.classId).map(h=>`<p><b>${esc(h.title)}</b><br><small>Due ${fmtDate(h.due)}</small></p>`).join('')||emptyState('📚','No homework.')}</section></div>`:'');
 }
}

/* ---------------- generic table ---------------- */
function tableShell(title,sub,toolbarHtml,headHtml,rowsHtml,extra){
 return `${crumb(title)}<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(sub||'')}</p></div><div class="quick-actions">${extra||''}</div></div>
 <div class="toolbar">${toolbarHtml||''}</div><div class="table-wrap"><table><thead><tr>${headHtml}</tr></thead><tbody id="tbl-body">${rowsHtml}</tbody></table></div><div class="pager" id="tbl-pager"></div>`;
}
function paginate(list,page,per){ const pages=Math.max(1,Math.ceil(list.length/per)); const p=Math.min(page,pages); return {rows:list.slice((p-1)*per,p*per),pages,page:p,total:list.length}; }
function bindTable(list,renderRow,per){
 let q='',page=1,sortKey=null,sortDir=1;
 const apply=()=>{ let f=list.filter(r=>!q||JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  if(sortKey) f=[...f].sort((a,b)=>String(a[sortKey]??'').localeCompare(String(b[sortKey]??''))*sortDir);
  const pg=paginate(f,page,per||10); const b=$('#tbl-body'); if(b) b.innerHTML=pg.rows.length?pg.rows.map(renderRow).join(''):`<tr><td colspan="9">${emptyState('🔍','No records match your search.')}</td></tr>`;
  const pgEl=$('#tbl-pager'); if(pgEl) pgEl.innerHTML=`Showing ${pg.rows.length} of ${pg.total} • Page ${pg.page}/${pg.pages} <button class="btn btn-ghost btn-sm" onclick="window.__pg(-1)">← Prev</button><button class="btn btn-ghost btn-sm" onclick="window.__pg(1)">Next →</button>`;
  window.__pg=d=>{ page=Math.min(pg.pages,Math.max(1,page+d)); apply(); }; };
 const qi=$('#tbl-q'); if(qi) qi.oninput=e=>{ q=e.target.value; page=1; apply(); };
 window.__sort=k=>{ if(sortKey===k) sortDir*=-1; else {sortKey=k; sortDir=1;} apply(); };
 apply();
}

/* ---------------- Students ---------------- */
function viewStudents(){
 const v=$('#view');
 v.innerHTML=tableShell('Students','Search, filter, sort and manage every student. Click a name for the full profile.',
  `<input id="tbl-q" placeholder="🔍 Search name, ID, class…"><select id="flt-class" onchange="window.__fc=this.value"><option value="">All classes</option>${DB.classes.map(c=>`<option value="${c.id}">${c.name}-${c.section}</option>`).join('')}</select>`,
  `<th onclick="window.__sort('name')" style="cursor:pointer">Name ↕</th><th>ID</th><th>Class</th><th>Roll</th><th>Parent</th><th>Attendance</th><th>Fees</th><th></th>`,
  '',`<button class="btn btn-primary" onclick="studentForm()">＋ Add student</button><button class="btn btn-ghost" onclick="exportStudents()">⬇ Export CSV</button>`);
 let cls='';
 window.__fc=c=>{ cls=c; window.__applyS&&window.__applyS(); };
 const renderRow=s=>{ const p=parentById(s.parentId); const bal=feeBalance(s.id); return `<tr><td><b>${esc(s.name)}</b><br><small>${esc(s.admissionNo)}</small></td><td>${s.id}</td><td>${classLabel(s.classId)}</td><td>${s.roll}</td><td>${p?esc(p.name):'—'}</td><td>${attPct(s.id)}%</td><td>${bal===0?pill('Paid','pill-green'):pill(PKR(bal),'pill-amber')}</td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="viewStudent('${s.id}')">View</button> <button class="btn btn-ghost btn-sm" onclick="studentForm('${s.id}')">Edit</button> <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}')">Delete</button></td></tr>`; };
 let q='',page=1;
 const apply=()=>{ let f=DB.students.filter(s=>(!cls||s.classId===cls)&&(!q||JSON.stringify(s).toLowerCase().includes(q.toLowerCase()))); const pg=paginate(f,page,10); $('#tbl-body').innerHTML=pg.rows.length?pg.rows.map(renderRow).join(''):`<tr><td colspan="8">${emptyState('🧑‍🎓','No students found. Try a different search or add a student.')}</td></tr>`; $('#tbl-pager').innerHTML=`Showing ${pg.rows.length} of ${pg.total} • Page ${pg.page}/${pg.pages} <button class="btn btn-ghost btn-sm" onclick="window.__sp(-1)">← Prev</button><button class="btn btn-ghost btn-sm" onclick="window.__sp(1)">Next →</button>`; window.__sp=d=>{page=Math.min(pg.pages,Math.max(1,page+d));apply();}; };
 window.__applyS=apply; $('#tbl-q').oninput=e=>{q=e.target.value;page=1;apply();}; apply();
}
function exportStudents(){ exportCSV('students.csv',[['ID','Name','Class','Roll','Parent','Attendance %','Fee balance PKR'],...DB.students.map(s=>[s.id,s.name,classLabel(s.classId),s.roll,(parentById(s.parentId)||{}).name||'',attPct(s.id),feeBalance(s.id)])]); }
function studentForm(id){
 const s=id?studentById(id):null;
 openModal(s?'Edit student':'Add student',`<form id="sf" class="form-grid">
  <div class="field"><label>Full name *</label><input name="name" required value="${esc(s?.name||'')}"></div>
  <div class="field"><label>Class *</label><select name="classId">${DB.classes.map(c=>`<option value="${c.id}" ${s?.classId===c.id?'selected':''}>${c.name}-${c.section}</option>`).join('')}</select></div>
  <div class="field"><label>Roll number</label><input name="roll" type="number" min="1" value="${s?.roll||''}"></div>
  <div class="field"><label>Gender</label><select name="gender"><option ${s?.gender==='Male'?'selected':''}>Male</option><option ${s?.gender==='Female'?'selected':''}>Female</option></select></div>
  <div class="field"><label>Date of birth</label><input name="dob" type="date" value="${s?.dob||''}"></div>
  <div class="field"><label>Blood group</label><input name="blood" value="${esc(s?.blood||'')}"></div>
  <div class="field full"><label>Address</label><input name="address" value="${esc(s?.address||'')}"></div>
  <div class="field"><label>Parent</label><select name="parentId">${DB.parents.map(p=>`<option value="${p.id}" ${s?.parentId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
  <div class="field"><label>Phone</label><input name="phone" value="${esc(s?.phone||'')}"></div></form>`,
  [{label:'Cancel',cls:'btn-ghost'},{label:s?'Save changes':'Add student',cls:'btn-primary',fn:()=>{
   const f=new FormData($('#sf')); const name=(f.get('name')||'').toString().trim(); if(!name){ toast('Full name is required.','err'); return; }
   if(s){ Object.assign(s,{name,classId:f.get('classId'),roll:+f.get('roll')||s.roll,gender:f.get('gender'),dob:f.get('dob'),blood:f.get('blood'),address:f.get('address'),parentId:f.get('parentId'),phone:f.get('phone')}); audit('Updated student '+name); }
   else { const ns={id:uid('S'),admissionNo:'AN-2026-'+Math.floor(100+Math.random()*800),name,classId:f.get('classId'),roll:+f.get('roll')||1,gender:f.get('gender'),dob:f.get('dob')||'2015-01-01',blood:f.get('blood')||'',phone:f.get('phone')||'',address:f.get('address')||'',parentId:f.get('parentId'),status:'Active',admissionDate:todayStr(),medical:''}; DB.students.push(ns); DB.fees.push({id:'INV-'+Math.floor(3000+Math.random()*6000),studentId:ns.id,month:'November 2026',amount:8000,paid:0,due:'2026-11-10',discount:0,status:'Pending'}); audit('Added student '+name); }
   save(); toast('Student saved ✅'); render(); }}]);
}
function deleteStudent(id){ const s=studentById(id); confirmDlg(`Delete ${s.name}? Their attendance, marks and fee records will also be removed. This cannot be undone.`,()=>{ DB.students=DB.students.filter(x=>x.id!==id); DB.attendance=DB.attendance.filter(a=>a.studentId!==id); DB.marks=DB.marks.filter(m=>m.studentId!==id); DB.fees=DB.fees.filter(f=>f.studentId!==id); save(); toast('Student deleted.'); render(); }); }
function viewStudent(id){
 const s=studentById(id); if(!s) return; const p=parentById(s.parentId); const avg=studentAvg(id);
 const rows=DB.marks.filter(m=>m.studentId===id);
 openModal(s.name,`<div class="kv"><dt>Student ID</dt><dd>${s.id} • ${esc(s.admissionNo)}</dd><dt>Class</dt><dd>${classLabel(s.classId)} • Roll ${s.roll}</dd><dt>Date of birth</dt><dd>${fmtDate(s.dob)} • ${esc(s.blood||'')}</dd><dt>Parent</dt><dd>${p?esc(p.name)+' • '+esc(p.phone):'—'}</dd><dt>Address</dt><dd>${esc(s.address)}</dd><dt>Attendance</dt><dd>${attPct(id)}% this term</dd><dt>Midterm average</dt><dd>${avg===null?'—':avg+'% ('+GRADE(avg)+')'}</dd><dt>Fee balance</dt><dd>${PKR(feeBalance(id))}</dd></div>
 <h3 style="margin-top:16px">📋 Midterm marks</h3>${rows.length?`<div class="table-wrap"><table><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>${rows.map(m=>`<tr><td>${esc(m.subject)}</td><td>${m.obtained}/${m.total}</td><td>${pill(GRADE(m.obtained/m.total*100),gradePill(GRADE(m.obtained/m.total*100)))}</td></tr>`).join('')}</table></div>`:emptyState('📋','No marks recorded yet.')}
 <p style="margin-top:12px"><b>Medical:</b> ${esc(s.medical||'None recorded.')}</p>`,
 [{label:'Print ID card',cls:'btn-ghost',fn:()=>printIDCard(s)},{label:'Close',cls:'btn-primary'}]);
}
function printIDCard(s){ printSection(`<div style="text-align:center"><h1>${esc(DB.school.name)}</h1><p>Student Identity Card</p><h2>${esc(s.name)}</h2><p>${s.id} • ${esc(s.admissionNo)}<br>${classLabel(s.classId)} • Roll ${s.roll}<br>Blood: ${esc(s.blood||'—')} • Valid: ${esc(DB.school.academicYear)}</p><p>Principal's signature: ________________</p></div>`,'ID Card — '+s.name); }

/* ---------------- Admissions ---------------- */
function viewAdmissions(){
 const v=$('#view'); const counts={}; DB.admissions.forEach(a=>counts[a.status]=(counts[a.status]||0)+1);
 v.innerHTML=`${crumb('Admissions')}<div class="page-head"><div><h1>Admissions</h1><p>Online applications, interviews, tests and enrolment — ${DB.admissions.length} applications this term.</p></div><button class="btn btn-primary" onclick="admissionForm()">＋ New application</button></div>
 <div class="grid g4" style="margin-bottom:16px">${['Inquiry','Applied','Under Review','Test Scheduled','Approved','Admitted'].map(s=>statCard('📝','ic-purple',counts[s]||0,s,'')).join('')}</div>
 <div class="table-wrap"><table><tr><th>Applicant</th><th>Class</th><th>Status</th><th>Date</th><th>Guardian / Phone</th><th></th></tr>${DB.admissions.map(a=>`<tr><td><b>${esc(a.name)}</b></td><td>${esc(a.cls)}</td><td>${statusPill(a.status)}</td><td>${fmtDate(a.date)}</td><td>${esc(a.guardian)}<br><small>${esc(a.phone)}</small></td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="setAdmission('${a.id}','Approved')">Approve</button> <button class="btn btn-ghost btn-sm" onclick="setAdmission('${a.id}','Rejected')">Reject</button> <button class="btn btn-primary btn-sm" onclick="convertAdmission('${a.id}')">Convert to student →</button></td></tr>`).join('')}</table></div>`;
}
function setAdmission(id,st){ const a=DB.admissions.find(x=>x.id===id); a.status=st; save(); toast(a.name+' → '+st); render(); }
function admissionForm(){ openModal('New admission application',`<form id="af" class="form-grid"><div class="field"><label>Applicant name *</label><input name="name" required></div><div class="field"><label>Class applied for</label><select name="cls">${DB.classes.map(c=>`<option>${c.name}</option>`).join('')}</select></div><div class="field"><label>Guardian name</label><input name="guardian"></div><div class="field"><label>Phone</label><input name="phone" placeholder="03XX-XXXXXXX"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Save application',cls:'btn-primary',fn:()=>{ const f=new FormData($('#af')); const name=(f.get('name')||'').toString().trim(); if(!name){toast('Applicant name is required.' ,'err');return false;} DB.admissions.unshift({id:uid('AD'),name,cls:f.get('cls'),status:'Applied',date:todayStr(),phone:f.get('phone')||'',guardian:f.get('guardian')||''}); save(); toast('Application saved ✅'); render(); }}]); }
function convertAdmission(id){ const a=DB.admissions.find(x=>x.id===id); if(!a) return; if(a.status!=='Approved'){ toast('Approve the application first.','err'); return; } const cls=DB.classes.find(c=>c.name===a.cls)||DB.classes[0]; const ns={id:uid('S'),admissionNo:'AN-2026-'+Math.floor(100+Math.random()*800),name:a.name,classId:cls.id,roll:DB.students.filter(s=>s.classId===cls.id).length+1,gender:'—',dob:'2015-01-01',blood:'',phone:a.phone,address:'',parentId:DB.parents[0].id,status:'Active',admissionDate:todayStr(),medical:''}; DB.students.push(ns); DB.fees.push({id:'INV-'+Math.floor(3000+Math.random()*6000),studentId:ns.id,month:'November 2026',amount:8000,paid:0,due:'2026-11-10',discount:0,status:'Pending'}); a.status='Admitted'; save(); toast(a.name+' is now a student in '+classLabel(cls.id)+' ✅'); render(); }

/* ---------------- Teachers / Staff / Academics ---------------- */
function viewTeachers(){
 const v=$('#view'); const u=currentUser();
 v.innerHTML=tableShell('Teachers','Complete teacher records, assignments and salaries.',
  `<input id="tbl-q" placeholder="🔍 Search teacher…">`,`<th>Name</th><th>Subject</th><th>Classes</th><th>Qualification</th><th>Salary</th><th></th>`,
  DB.teachers.map(t=>`<tr><td><b>${esc(t.name)}</b><br><small>${esc(t.email)}</small></td><td>${esc(t.subject)}</td><td>${t.classes.map(classLabel).join(', ')}</td><td>${esc(t.qual)} • ${esc(t.exp)}</td><td>${PKR(t.salary)}</td><td><button class="btn btn-ghost btn-sm" onclick="viewTeacher('${t.id}')">View</button></td></tr>`).join(''),
  u.role==='admin'?`<button class="btn btn-primary" onclick="teacherForm()">＋ Add teacher</button>`:'');
 bindTable(DB.teachers,r=>`<tr><td><b>${esc(r.name)}</b><br><small>${esc(r.email)}</small></td><td>${esc(r.subject)}</td><td>${r.classes.map(classLabel).join(', ')}</td><td>${esc(r.qual)}</td><td>${PKR(r.salary)}</td><td><button class="btn btn-ghost btn-sm" onclick="viewTeacher('${r.id}')">View</button></td></tr>`);
}
function viewTeacher(id){ const t=teacherById(id); openModal(t.name,`<div class="kv"><dt>Teacher ID</dt><dd>${t.id}</dd><dt>Subject</dt><dd>${esc(t.subject)}</dd><dt>Classes</dt><dd>${t.classes.map(classLabel).join(', ')}</dd><dt>Qualification</dt><dd>${esc(t.qual)} • ${esc(t.exp)} experience</dd><dt>Joined</dt><dd>${fmtDate(t.join)}</dd><dt>Phone</dt><dd>${esc(t.phone)}</dd><dt>Salary</dt><dd>${PKR(t.salary)} / month</dd><dt>Status</dt><dd>${esc(t.status)}</dd></div>`,[{label:'Close',cls:'btn-primary'}]); }
function teacherForm(){ openModal('Add teacher',`<form id="tf" class="form-grid"><div class="field"><label>Full name *</label><input name="name" required></div><div class="field"><label>Email</label><input name="email" type="email"></div><div class="field"><label>Subject</label><input name="subject"></div><div class="field"><label>Qualification</label><input name="qual"></div><div class="field"><label>Phone</label><input name="phone"></div><div class="field"><label>Monthly salary (PKR)</label><input name="salary" type="number" value="70000"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Add teacher',cls:'btn-primary',fn:()=>{ const f=new FormData($('#tf')); const name=(f.get('name')||'').toString().trim(); if(!name){toast('Name is required.' ,'err');return false;} DB.teachers.push({id:uid('T'),name,email:f.get('email')||'',subject:f.get('subject')||'General',classes:[],phone:f.get('phone')||'',qual:f.get('qual')||'',exp:'—',salary:+f.get('salary')||0,join:todayStr(),status:'Active'}); save(); toast('Teacher added ✅'); render(); }}]); }
function viewStaff(){
 const v=$('#view');
 v.innerHTML=`${crumb('Staff & HR')}<div class="page-head"><div><h1>Staff &amp; HR</h1><p>Non-teaching staff, leave requests and payroll overview.</p></div><button class="btn btn-primary" onclick="go('leave')">🌿 Leave requests (${DB.leaves.filter(l=>l.status==='Pending').length} pending)</button></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">💼</span>Staff directory</h3><div class="table-wrap"><table><tr><th>Name</th><th>Role</th><th>Dept</th><th>Salary</th></tr>${DB.staff.map(s=>`<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.role)}</td><td>${esc(s.dept)}</td><td>${PKR(s.salary)}</td></tr>`).join('')}</table></div></section>
 <section class="card tint-grey"><h3><span class="ci">💰</span>Monthly payroll</h3>${barRow('Teachers',82,PKR(DB.teachers.reduce((a,t)=>a+t.salary,0)),'')}${barRow('Staff',60,PKR(DB.staff.reduce((a,t)=>a+t.salary,0)),'orange')}<p class="muted">Total monthly payroll: <b>${PKR(DB.teachers.reduce((a,t)=>a+t.salary,0)+DB.staff.reduce((a,t)=>a+t.salary,0))}</b>. Salary slips are generated from the Documents view (print-ready).</p><p class="hint">Payroll is a record-keeping view in this demo. Bank transfers are integration-ready only.</p></section></div>`;
}
function viewAcademics(){
 const v=$('#view');
 v.innerHTML=`${crumb('Academics')}<div class="page-head"><div><h1>Academics</h1><p>Academic year ${esc(DB.school.academicYear)} • ${DB.classes.length} classes • ${DB.subjects.length} subjects • Working days: ${esc(DB.settings.workingDays)}</p></div><button class="btn btn-primary" onclick="addClass()">＋ Add class</button></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">🏫</span>Classes &amp; sections</h3><div class="table-wrap"><table><tr><th>Class</th><th>Class teacher</th><th>Room</th><th>Students</th></tr>${DB.classes.map(c=>`<tr><td><b>${c.name}-${c.section}</b></td><td>${esc((teacherById(c.teacherId)||{}).name||'—')}</td><td>${esc(c.room)}</td><td>${DB.students.filter(s=>s.classId===c.id).length} / ${c.capacity}</td></tr>`).join('')}</table></div></section>
 <section class="card"><h3><span class="ci">📖</span>Subjects</h3>${DB.subjects.map(s=>pill(s.name+' ('+s.code+')','pill-purple')).join(' ')}<h3 style="margin-top:18px"><span class="ci">⚙️</span>Academic settings</h3><div class="kv"><dt>Grading</dt><dd>${esc(DB.settings.grading)}</dd><dt>Attendance rule</dt><dd>${esc(DB.settings.attendanceRule)}</dd><dt>Timings</dt><dd>${esc(DB.settings.timings)}</dd></div></section></div>`;
}
function addClass(){ openModal('Add class',`<form id="cf" class="form-grid"><div class="field"><label>Class name *</label><input name="name" required placeholder="e.g. Class 7"></div><div class="field"><label>Section</label><input name="section" value="A"></div><div class="field"><label>Room</label><input name="room" placeholder="R-09"></div><div class="field"><label>Capacity</label><input name="capacity" type="number" value="30"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Add class',cls:'btn-primary',fn:()=>{ const f=new FormData($('#cf')); const name=(f.get('name')||'').toString().trim(); if(!name){toast('Class name is required.' ,'err');return false;} DB.classes.push({id:uid('C'),name,section:f.get('section')||'A',teacherId:DB.teachers[0].id,room:f.get('room')||'—',capacity:+f.get('capacity')||30}); save(); toast('Class added ✅'); render(); }}]); }

/* ---------------- Attendance ---------------- */
let attClass='C5A', attDate=null, attDraft={};
function viewAttendance(u){
 const v=$('#view'); attDate=attDate||todayStr();
 const scoped=myClasses(); const cls=scoped.find(c=>c.id===attClass)||scoped[0]; attClass=cls?cls.id:'C5A';
 const list=DB.students.filter(s=>s.classId===attClass);
 v.innerHTML=`${crumb('Attendance')}<div class="page-head"><div><h1>Attendance — mark in under a minute</h1><p>Pick a class and date, tap Present / Absent / Late / Leave, then save. Saved attendance updates every dashboard instantly.</p></div></div>
 <div class="toolbar"><select id="att-class" onchange="attClass=this.value;attDraft={};render()">${scoped.map(c=>`<option value="${c.id}" ${c.id===attClass?'selected':''}>${c.name}-${c.section}</option>`).join('')}</select>
 <input type="date" id="att-date" value="${attDate}" onchange="attDate=this.value;attDraft={};render()" style="max-width:190px">
 <span class="spacer"></span><button class="btn btn-ghost" onclick="markAllAtt('Present')">✓ All present</button><button class="btn btn-primary" onclick="saveAttendance()">💾 Save attendance</button></div>
 <div class="card"><h3><span class="ci">✅</span>${classLabel(attClass)} — ${fmtDate(attDate)} • ${list.length} students</h3>
 ${list.length?list.map(s=>{ const saved=DB.attendance.find(a=>a.studentId===s.id&&a.date===attDate); const cur=attDraft[s.id]||saved?.status||'Present'; return `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid #f1f5f9"><b style="min-width:170px">${esc(s.name)} <small class="muted">• Roll ${s.roll}</small></b><div class="att-btns">${['Present','Absent','Late','Leave'].map(st=>`<button class="btn btn-ghost btn-sm ${cur===st?'on-'+st.toLowerCase():''}" onclick="attDraft['${s.id}']='${st}';render()">${st}</button>`).join('')}</div><span class="muted" style="margin-left:auto">This term: ${attPct(s.id)}%</span></div>`; }).join(''):emptyState('🧑‍🎓','No students in this class yet.')}</div>`;
}
function markAllAtt(st){ DB.students.filter(s=>s.classId===attClass).forEach(s=>attDraft[s.id]=st); render(); }
function saveAttendance(){ const list=DB.students.filter(s=>s.classId===attClass); list.forEach(s=>{ const st=attDraft[s.id]||'Present'; const ex=DB.attendance.find(a=>a.studentId===s.id&&a.date===attDate); if(ex) ex.status=st; else DB.attendance.push({date:attDate,studentId:s.id,classId:attClass,status:st}); }); attDraft={}; save(); audit('Attendance saved for '+classLabel(attClass)+' ('+attDate+')'); toast('Attendance saved ✅ — dashboards updated'); render(); }

/* ---------------- Timetable ---------------- */
function viewTimetable(u){
 const v=$('#view'); const scoped=myClasses(); const cid=routeParam||scoped[0]?.id||'C5A';
 const conflicts=[]; DB.timetable.forEach((e,i)=>DB.timetable.forEach((f,j)=>{ if(i<j&&e.day===f.day&&e.period===f.period&&(e.teacherId===f.teacherId||e.room===f.room)&&e.classId!==f.classId) conflicts.push(e.teacherId===f.teacherId?`Teacher ${teacherById(e.teacherId)?.name} is double-booked ${e.day} period ${e.period}`:`Room ${e.room} is double-booked ${e.day} period ${e.period}`); }));
 const uniq=[...new Set(conflicts)];
 v.innerHTML=`${crumb('Timetable')}<div class="page-head"><div><h1>Weekly timetable</h1><p>Conflict detection runs automatically — a teacher or a room can never be in two places at once.</p></div><div class="quick-actions"><button class="btn btn-ghost" onclick="printSection(document.getElementById('tt-print').innerHTML,'Timetable')">🖨️ Print timetable</button></div></div>
 ${uniq.length?`<div class="notice amber">⚠️ <b>Conflicts found:</b> ${uniq.slice(0,3).map(esc).join('<br>')}</div>`:`<div class="notice green">✅ No conflicts — every teacher and room is free in their assigned slots.</div>`}
 <div class="toolbar"><select onchange="go('timetable',this.value)">${scoped.map(c=>`<option value="${c.id}" ${c.id===cid?'selected':''}>${c.name}-${c.section}</option>`).join('')}</select></div>
 <div id="tt-print"><div class="table-wrap"><table class="timetable"><tr><th>Period</th>${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr>${[1,2,3,4,5,6].map(p=>`<tr><td><b>Period ${p}</b></td>${DAYS.map(d=>{ const e=DB.timetable.find(x=>x.classId===cid&&x.day===d&&x.period===p); return e?`<td><b>${esc(e.subject)}</b><br><small>${esc((teacherById(e.teacherId)||{}).name||'')} • ${esc(e.room)}</small></td>`:`<td class="free">Free</td>`; }).join('')}</tr>`).join('')}</table></div></div>
 <p class="hint" style="margin-top:12px">Break after Period 3 • Lunch 12:30–1:00 • Assembly every Monday 7:45 AM. To change a slot, an admin edits it in Settings → Timetable (demo: slots are seeded; conflict check is live).</p>`;
}

/* ---------------- Exams & Results ---------------- */
let exClass='C5A', exSubject='Mathematics';
function viewExams(u){
 const v=$('#view'); const scoped=myClasses(); const cls=scoped.find(c=>c.id===exClass)||scoped[0]; exClass=cls?cls.id:'C5A';
 const list=DB.students.filter(s=>s.classId===exClass);
 const canEdit=u.role==='admin'||u.role==='teacher';
 v.innerHTML=`${crumb('Examinations & Results')}<div class="page-head"><div><h1>Midterm Examination 2026</h1><p>Enter marks quickly — grades are calculated automatically (A+ ≥90, A ≥80, B ≥70, C ≥60, D ≥50, E ≥40, F below 40).</p></div><div class="quick-actions"><button class="btn btn-ghost" onclick="showReportCard('${list[0]?.id||''}')">🖨️ Sample report card</button></div></div>
 <div class="toolbar"><select onchange="exClass=this.value;render()">${scoped.map(c=>`<option value="${c.id}" ${c.id===exClass?'selected':''}>${c.name}-${c.section}</option>`).join('')}</select>
 <select onchange="exSubject=this.value;render()">${DB.subjects.slice(0,6).map(s=>`<option ${s.name===exSubject?'selected':''}>${s.name}</option>`).join('')}</select>
 <span class="spacer"></span>${canEdit?`<button class="btn btn-primary" onclick="saveMarks()">💾 Save marks</button>`:''}</div>
 <div class="table-wrap"><table><tr><th>Student</th><th>Marks / 100</th><th>Grade</th><th>Class average</th></tr>${list.map(s=>{ const m=DB.marks.find(x=>x.studentId===s.id&&x.subject===exSubject&&x.examId==='EX01'); return `<tr><td><b>${esc(s.name)}</b> <small>Roll ${s.roll}</small></td><td>${canEdit?`<input type="number" min="0" max="100" value="${m?.obtained??''}" data-marks="${s.id}" style="max-width:110px;background:#fff">`:(m?m.obtained+'/100':'—')}</td><td>${m?pill(GRADE(m.obtained),gradePill(GRADE(m.obtained))):'—'}</td><td>${studentAvg(s.id)===null?'—':studentAvg(s.id)+'%'}</td></tr>`; }).join('')}</table></div>
 ${list.length?'':emptyState('📋','No students in this class.')}
 <div class="grid g2" style="margin-top:16px"><section class="card"><h3><span class="ci">🏆</span>Top performers — ${classLabel(exClass)}</h3>${[...list].sort((a,b)=>(studentAvg(b.id)||0)-(studentAvg(a.id)||0)).slice(0,3).map((s,i)=>`<p>${['🥇','🥈','🥉'][i]} <b>${esc(s.name)}</b> — ${studentAvg(s.id)}% average</p>`).join('')}</section>
 <section class="card tint-grey"><h3><span class="ci">📊</span>Subject averages</h3>${['Mathematics','English','Science','Urdu'].map(sub=>{ const ms=DB.marks.filter(m=>m.subject===sub); const avg=ms.length?Math.round(ms.reduce((a,m)=>a+m.obtained,0)/ms.length):0; return barRow(sub,avg,avg+'%'); }).join('')}</section></div>`;
}
function saveMarks(){ let n=0; $$('[data-marks]').forEach(inp=>{ const sid=inp.dataset.marks; const val=+inp.value; if(inp.value===''||isNaN(val)) return; const ex=DB.marks.find(m=>m.studentId===sid&&m.subject===exSubject&&m.examId==='EX01'); if(ex) ex.obtained=Math.min(100,Math.max(0,val)); else DB.marks.push({examId:'EX01',studentId:sid,subject:exSubject,obtained:Math.min(100,Math.max(0,val)),total:100}); n++; }); save(); toast(n+' mark(s) saved ✅'); render(); }
function showReportCard(sid){ const s=studentById(sid); if(!s){ toast('No student selected.','err'); return; } const rows=DB.marks.filter(m=>m.studentId===sid); const avg=studentAvg(sid);
 printSection(`<h1>${esc(DB.school.name)}</h1><p>Report Card — Midterm Examination 2026</p><p><b>${esc(s.name)}</b> • ${classLabel(s.classId)} • Roll ${s.roll} • ${esc(s.admissionNo)}</p><table><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>${rows.map(m=>`<tr><td>${esc(m.subject)}</td><td>${m.obtained}/${m.total}</td><td>${GRADE(m.obtained/m.total*100)}</td></tr>`).join('')}</table><p><b>Average: ${avg}% — Grade ${GRADE(avg||0)}</b> • Attendance: ${attPct(sid)}%</p><p>Class Teacher: ________________ &nbsp; Principal: ________________</p>`,'Report Card — '+s.name); }

/* ---------------- Fees & Finance ---------------- */
function viewFees(u){
 const v=$('#view'); const kids=u.role==='parent'?myStudents():u.role==='student'?myStudents():null;
 let list=DB.fees; if(kids) list=list.filter(f=>kids.some(k=>k.id===f.studentId));
 const total=list.reduce((a,f)=>a+f.amount,0), paid=list.reduce((a,f)=>a+f.paid,0), out=list.reduce((a,f)=>a+(f.amount-f.paid-(f.discount||0)),0);
 v.innerHTML=`${crumb('Fees & Finance')}<div class="page-head"><div><h1>Fees &amp; finance</h1><p>Every payment gets a unique receipt number. Currency: PKR.</p></div>${u.role==='admin'?`<button class="btn btn-primary" onclick="recordPayment()">💰 Record payment — 3 clicks</button>`:''}</div>
 <div class="grid g4" style="margin-bottom:16px">${statCard('💰','ic-blue',PKR(total),'Total billed','November 2026')}${statCard('✅','ic-green',PKR(paid),'Collected','')}${statCard('⏰','ic-amber',PKR(out),'Outstanding',DB.fees.filter(f=>f.status==='Overdue').length+' overdue')}${statCard('🧾','ic-purple',DB.payments.length,'Receipts issued','Unique receipt numbers')}</div>
 <div class="grid g2"><section class="card"><h3><span class="ci">🧾</span>Fee structure</h3>${DB.feeStructure.map(f=>`<p><b>${esc(f.cls)}</b> — ${PKR(f.monthly)}/month • Admission ${PKR(f.admission)}</p>`).join('')}<p class="muted">Discounts: sibling 10%, scholarship on merit, staff children 20%. Late fine: PKR 500 after the 10th.</p></section>
 <section class="card"><h3><span class="ci">💳</span>Payment methods</h3><p>Cash, bank transfer, JazzCash, EasyPaisa (integration-ready). Card / online gateway: <b>requires configuration</b> — no card details are stored in this demo.</p></section></div>
 <div class="card" style="margin-top:16px"><h3><span class="ci">📋</span>Invoices</h3><div class="table-wrap"><table><tr><th>Invoice</th><th>Student</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th></th></tr>${list.slice(0,15).map(f=>{ const s=studentById(f.studentId); const bal=f.amount-f.paid-(f.discount||0); return `<tr><td>${f.id}</td><td>${s?esc(s.name):'—'}<br><small>${classLabel(s?.classId||'')}</small></td><td>${PKR(f.amount)}</td><td>${PKR(f.paid)}</td><td>${PKR(bal)}</td><td>${statusPill(f.status)}</td><td>${u.role==='admin'&&bal>0?`<button class="btn btn-primary btn-sm" onclick="recordPayment('${f.id}')">Pay</button>`:''} <button class="btn btn-ghost btn-sm" onclick="printReceipt('${f.id}')">Receipt</button></td></tr>`; }).join('')}</table></div></div>`;
}
function recordPayment(invId){
 const open=DB.fees.filter(f=>(f.amount-f.paid-(f.discount||0))>0); if(!open.length){ toast('No outstanding invoices.','err'); return; }
 const f=invId?DB.fees.find(x=>x.id===invId):open[0];
 openModal('Record fee payment',`<form id="pf" class="form-grid"><div class="field full"><label>Invoice *</label><select name="inv">${open.map(x=>{ const s=studentById(x.studentId); return `<option value="${x.id}" ${x.id===f.id?'selected':''}>${x.id} — ${esc(s?.name||'')} — balance ${PKR(x.amount-x.paid-(x.discount||0))}</option>`; }).join('')}</select></div>
 <div class="field"><label>Amount (PKR) *</label><input name="amount" type="number" min="1" required value="${f.amount-f.paid-(f.discount||0)}"></div>
 <div class="field"><label>Method</label><select name="method"><option>Cash</option><option>Bank Transfer</option><option>JazzCash</option><option>EasyPaisa</option></select></div></form>
 <p class="hint">Click 3: confirm → receipt number is generated automatically.</p>`,
 [{label:'Cancel',cls:'btn-ghost'},{label:'Confirm payment',cls:'btn-primary',fn:()=>{ const fd=new FormData($('#pf')); const inv=DB.fees.find(x=>x.id===fd.get('inv')); const amt=+fd.get('amount'); if(!amt||amt<=0){toast('Enter a valid amount.' ,'err');return false;} inv.paid+=amt; const bal=inv.amount-inv.paid-(inv.discount||0); inv.status=bal<=0?'Paid':'Pending'; const rcp='RCP-2026-'+(1000+DB.payments.length+1); DB.payments.unshift({receipt:rcp,invoiceId:inv.id,studentId:inv.studentId,amount:amt,date:todayStr(),method:fd.get('method'),receivedBy:currentUser().name}); save(); toast('Payment recorded ✅ Receipt '+rcp); render(); }}]);
}
function printReceipt(invId){ const f=DB.fees.find(x=>x.id===invId); const s=studentById(f.studentId); const pay=DB.payments.find(p=>p.invoiceId===invId);
 printSection(`<h1>${esc(DB.school.name)}</h1><p>Fee Receipt ${pay?pay.receipt:'—'}</p><p>Student: <b>${esc(s?.name||'')}</b> • ${classLabel(s?.classId||'')} • Invoice ${f.id}<br>Month: ${esc(f.month)} • Amount: ${PKR(f.amount)} • Paid: ${PKR(f.paid)} • Balance: ${PKR(f.amount-f.paid-(f.discount||0))}<br>Method: ${pay?esc(pay.method):'—'} • Date: ${pay?fmtDate(pay.date):'—'}</p><p>Received by: ________________</p>`,'Fee Receipt '+f.id); }

/* ---------------- Accounting ---------------- */
function viewAccounting(){
 const v=$('#view'); const inc=DB.ledger.filter(l=>l.type==='Income').reduce((a,l)=>a+l.amount,0), exp=DB.ledger.filter(l=>l.type==='Expense').reduce((a,l)=>a+l.amount,0);
 v.innerHTML=`${crumb('Accounting')}<div class="page-head"><div><h1>Accounting</h1><p>Income, expenses and cash flow for the school.</p></div><button class="btn btn-primary" onclick="addLedger()">＋ Add transaction</button></div>
 <div class="grid g3" style="margin-bottom:16px">${statCard('📈','ic-green',PKR(inc),'Total income','November 2026')}${statCard('📉','ic-red',PKR(exp),'Total expenses','')}${statCard('💰','ic-purple',PKR(inc-exp),'Net balance','')}</div>
 <div class="table-wrap"><table><tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Amount</th></tr>${DB.ledger.map(l=>`<tr><td>${fmtDate(l.date)}</td><td>${statusPill(l.type==='Income'?'Paid':'Pending')}</td><td>${esc(l.category)}</td><td>${esc(l.desc)}</td><td>${l.type==='Income'?'+':'−'} ${PKR(l.amount)}</td></tr>`).join('')}</table></div>`;
}
function addLedger(){ openModal('Add transaction',`<form id="lf" class="form-grid"><div class="field"><label>Type</label><select name="type"><option>Income</option><option>Expense</option></select></div><div class="field"><label>Category</label><input name="category" required></div><div class="field"><label>Amount (PKR)</label><input name="amount" type="number" required></div><div class="field"><label>Description</label><input name="desc"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Save',cls:'btn-primary',fn:()=>{ const f=new FormData($('#lf')); DB.ledger.unshift({id:uid('L'),date:todayStr(),type:f.get('type'),category:f.get('category')||'General',desc:f.get('desc')||'',amount:+f.get('amount')||0}); save(); toast('Transaction saved ✅'); render(); }}]); }

/* ---------------- Homework & Assignments ---------------- */
function viewHomework(u){
 const v=$('#view'); const scoped=u.role==='teacher'?myClasses():u.role==='admin'?DB.classes:myClasses();
 const list=DB.homework.filter(h=>scoped.some(c=>c.id===h.classId));
 const canCreate=u.role==='admin'||u.role==='teacher';
 v.innerHTML=`${crumb('Homework')}<div class="page-head"><div><h1>Homework</h1><p>${list.length} open homework tasks across your classes.</p></div>${canCreate?`<button class="btn btn-primary" onclick="homeworkForm()">＋ Create homework</button>`:''}</div>
 <div class="grid g2">${list.map(h=>`<article class="card lift"><h3><span class="ci">📚</span>${esc(h.title)}</h3><p>${esc(h.desc)}</p><p><small>${esc(h.subject)} • ${classLabel(h.classId)} • by ${esc((teacherById(h.teacherId)||{}).name||'')} • Due ${fmtDate(h.due)}</small></p>${statusPill(h.status)} ${u.role==='student'?`<button class="btn btn-ghost btn-sm" style="margin-left:8px" onclick="submitHomework('${h.id}')">Submit</button>`:''}</article>`).join('')||emptyState('📚','No homework assigned yet.')}</div>`;
}
function homeworkForm(){ const u=currentUser(); openModal('Create homework',`<form id="hf" class="form-grid"><div class="field full"><label>Title *</label><input name="title" required></div><div class="field"><label>Subject</label><select name="subject">${DB.subjects.map(s=>`<option>${s.name}</option>`).join('')}</select></div><div class="field"><label>Class</label><select name="classId">${myClasses().map(c=>`<option value="${c.id}">${c.name}-${c.section}</option>`).join('')}</select></div><div class="field"><label>Due date</label><input name="due" type="date" value="${todayStr()}"></div><div class="field full"><label>Instructions</label><textarea name="desc" rows="3"></textarea></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Assign homework',cls:'btn-primary',fn:()=>{ const f=new FormData($('#hf')); const title=(f.get('title')||'').toString().trim(); if(!title){toast('Title is required.' ,'err');return false;} DB.homework.unshift({id:uid('HW'),title,subject:f.get('subject'),classId:f.get('classId'),teacherId:u.teacherId||'T01',due:f.get('due')||todayStr(),desc:f.get('desc')||'',status:'Open'}); save(); toast('Homework assigned ✅ — parents and students notified in-app'); render(); }}]); }
function submitHomework(id){ const h=DB.homework.find(x=>x.id===id); openModal('Submit homework',`<p><b>${esc(h.title)}</b></p><div class="field"><label>Your answer / file name</label><input id="hw-file" placeholder="e.g. homework-ahmed.pdf"></div><p class="hint">In this demo, submission is recorded by file name. Real file upload needs secure storage — see docs/BACKEND.md.</p>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Submit',cls:'btn-primary',fn:()=>{ toast('Homework submitted ✅ — teacher will review it'); }}]); }
function viewAssignments(u){
 const v=$('#view'); const scoped=u.role==='teacher'?myClasses():u.role==='admin'?DB.classes:myClasses();
 const list=DB.assignments.filter(a=>scoped.some(c=>c.id===a.classId));
 const canCreate=u.role==='admin'||u.role==='teacher';
 v.innerHTML=`${crumb('Assignments')}<div class="page-head"><div><h1>Assignments</h1><p>Projects and assessed work with submissions and grading.</p></div>${canCreate?`<button class="btn btn-primary" onclick="assignmentForm()">＋ Create assignment</button>`:''}</div>
 ${list.map(a=>`<article class="card" style="margin-bottom:14px"><h3><span class="ci">📄</span>${esc(a.title)}</h3><p>${esc(a.desc)}</p><p><small>${esc(a.subject)} • ${classLabel(a.classId)} • Due ${fmtDate(a.due)} • Total ${a.total} marks • ${a.submissions.length} submission(s)</small></p>
 ${a.submissions.map(s=>{ const st=studentById(s.studentId); return `<p>📎 ${st?esc(st.name):''} — ${esc(s.file)} — ${s.grade!==undefined?('Grade: '+s.grade+'/'+a.total+' • '+esc(s.feedback||'')):'Not graded yet'}</p>`; }).join('')}
 <div class="quick-actions">${u.role==='student'?`<button class="btn btn-primary btn-sm" onclick="submitAssignment('${a.id}')">⬆ Submit assignment</button>`:''}${canCreate&&a.submissions.length?`<button class="btn btn-ghost btn-sm" onclick="gradeAssignment('${a.id}')">✏️ Grade submissions</button>`:''}</div></article>`).join('')||emptyState('📄','No assignments yet.')}`;
}
function assignmentForm(){ openModal('Create assignment',`<form id="asf" class="form-grid"><div class="field full"><label>Title *</label><input name="title" required></div><div class="field"><label>Subject</label><select name="subject">${DB.subjects.map(s=>`<option>${s.name}</option>`).join('')}</select></div><div class="field"><label>Class</label><select name="classId">${myClasses().map(c=>`<option value="${c.id}">${c.name}-${c.section}</option>`).join('')}</select></div><div class="field"><label>Due date</label><input name="due" type="date"></div><div class="field"><label>Total marks</label><input name="total" type="number" value="20"></div><div class="field full"><label>Instructions</label><textarea name="desc" rows="3"></textarea></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Create assignment',cls:'btn-primary',fn:()=>{ const f=new FormData($('#asf')); const title=(f.get('title')||'').toString().trim(); if(!title){toast('Title is required.' ,'err');return false;} DB.assignments.unshift({id:uid('AS'),title,subject:f.get('subject'),classId:f.get('classId'),teacherId:currentUser().teacherId||'T01',due:f.get('due')||todayStr(),desc:f.get('desc')||'',total:+f.get('total')||20,submissions:[]}); save(); toast('Assignment created ✅'); render(); }}]); }
function submitAssignment(id){ const a=DB.assignments.find(x=>x.id===id); const u=currentUser(); openModal('Submit assignment',`<p><b>${esc(a.title)}</b> — due ${fmtDate(a.due)}</p><div class="field"><label>File name</label><input id="as-file" placeholder="e.g. project-ahmed.pdf"></div>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Submit',cls:'btn-primary',fn:()=>{ const file=($('#as-file')?.value||'submission.pdf'); a.submissions.push({studentId:u.studentId,file}); save(); toast('Assignment submitted ✅'); render(); }}]); }
function gradeAssignment(id){ const a=DB.assignments.find(x=>x.id===id); const sub=a.submissions[0]; if(!sub){toast('No submissions yet.' ,'err');return false;} openModal('Grade submission',`<p>${esc((studentById(sub.studentId)||{}).name||'')} — ${esc(sub.file)}</p><div class="field"><label>Marks / ${a.total}</label><input id="gr-marks" type="number" min="0" max="${a.total}" value="${sub.grade??''}"></div><div class="field"><label>Feedback</label><input id="gr-fb" value="${esc(sub.feedback||'')}"></div>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Save grade',cls:'btn-primary',fn:()=>{ sub.grade=+($('#gr-marks').value||0); sub.feedback=$('#gr-fb').value; save(); toast('Grade saved ✅'); render(); }}]); }

/* ---------------- Library / Transport ---------------- */
function viewLibrary(u){
 const v=$('#view'); const kids=myStudents(); const myIssues=u.role==='student'||u.role==='parent'?DB.issues.filter(i=>kids.some(k=>k.id===i.studentId)):DB.issues;
 v.innerHTML=`${crumb('Library')}<div class="page-head"><div><h1>Library</h1><p>${DB.books.reduce((a,b)=>a+b.copies,0)} books in catalog • ${DB.issues.filter(i=>!i.returned).length} currently issued.</p></div>${u.role==='admin'?`<button class="btn btn-primary" onclick="addBook()">＋ Add book</button>`:''}</div>
 <div class="grid g2"><section class="card"><h3><span class="ci">📖</span>Catalog</h3><div class="table-wrap"><table><tr><th>Title</th><th>Author</th><th>Copies</th><th></th></tr>${DB.books.slice(0,12).map(b=>`<tr><td><b>${esc(b.title)}</b><br><small>${esc(b.category)} • ${esc(b.isbn)}</small></td><td>${esc(b.author)}</td><td>${b.copies-b.issued} / ${b.copies}</td><td>${u.role==='admin'?`<button class="btn btn-ghost btn-sm" onclick="issueBook('${b.id}')">Issue</button>`:''}</td></tr>`).join('')}</table></div></section>
 <section class="card"><h3><span class="ci">📥</span>Issued books</h3>${myIssues.length?myIssues.map(i=>{ const b=DB.books.find(x=>x.id===i.bookId); const s=studentById(i.studentId); return `<p><b>${esc(b?.title||'')}</b> — ${esc(s?.name||'')} • Due ${fmtDate(i.dueDate)} ${i.returned?statusPill('Returned'):pill('Issued','pill-amber')} ${!i.returned&&u.role==='admin'?`<button class="btn btn-ghost btn-sm" onclick="returnBook('${i.id}')">Return</button>`:''}</p>`; }).join(''):emptyState('📖','No books issued.')}</section></div>`;
}
function addBook(){ openModal('Add book',`<form id="bf" class="form-grid"><div class="field"><label>Title *</label><input name="title" required></div><div class="field"><label>Author</label><input name="author"></div><div class="field"><label>Category</label><input name="category"></div><div class="field"><label>Copies</label><input name="copies" type="number" value="3"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Add book',cls:'btn-primary',fn:()=>{ const f=new FormData($('#bf')); DB.books.unshift({id:uid('BK'),title:f.get('title'),author:f.get('author')||'',isbn:'978-969-'+Math.floor(1000+Math.random()*9000),copies:+f.get('copies')||1,issued:0,category:f.get('category')||'General'}); save(); toast('Book added ✅'); render(); }}]); }
function issueBook(id){ const b=DB.books.find(x=>x.id===id); if(b.copies-b.issued<=0){toast('No copies available.' ,'err');return false;} b.issued++; DB.issues.unshift({id:uid('IS'),bookId:id,studentId:DB.students[0].id,issueDate:todayStr(),dueDate:todayStr(),returned:false}); save(); toast('Book issued ✅'); render(); }
function returnBook(id){ const i=DB.issues.find(x=>x.id===id); i.returned=true; const b=DB.books.find(x=>x.id===i.bookId); if(b) b.issued=Math.max(0,b.issued-1); save(); toast('Book returned ✅'); render(); }
function viewTransport(){
 const v=$('#view');
 v.innerHTML=`${crumb('Transport')}<div class="page-head"><div><h1>Transport</h1><p>${DB.buses.length} buses • ${DB.buses.reduce((a,b)=>a+b.students,0)} students use school transport.</p></div></div>
 <div class="grid g3">${DB.buses.map(b=>`<article class="card lift"><h3><span class="ci">🚌</span>Bus ${esc(b.no)}</h3><p><b>${esc(b.route)}</b></p><div class="kv"><dt>Driver</dt><dd>${esc(b.driver)}</dd><dt>Capacity</dt><dd>${b.students} / ${b.capacity} students</dd></div><p class="hint">GPS live tracking is integration-ready — it needs a tracking provider configured. See README.</p></article>`).join('')}</div>`;
}

/* ---------------- Communication / Events / misc modules ---------------- */
function viewCommunication(){
 const v=$('#view');
 v.innerHTML=`${crumb('Communication')}<div class="page-head"><div><h1>Communication centre</h1><p>Announcements, notices and messages for the whole school.</p></div><button class="btn btn-primary" onclick="announcementForm()">📢 New announcement</button></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">📢</span>Announcements</h3>${DB.announcements.map(a=>`<p><b>${esc(a.title)}</b> ${a.pinned?'📌':''}<br><small>${fmtDate(a.date)} • ${esc(a.audience)}</small><br>${esc(a.body)}</p>`).join('')}</section>
 <section class="card"><h3><span class="ci">💬</span>Messages</h3>${DB.messages.map(m=>`<p><b>${esc(m.subject)}</b><br><small>From ${esc(m.from)} → ${esc(m.to)} • ${fmtDate(m.date)}</small><br>${esc(m.body)}</p>`).join('')}<button class="btn btn-ghost" onclick="go('messages')">Open messages →</button></section></div>
 <p class="hint">Email, SMS and WhatsApp delivery are integration-ready — they need provider credentials in Settings. In-app announcements and messages work now.</p>`;
}
function announcementForm(){ openModal('New announcement',`<form id="anf" class="form-grid"><div class="field full"><label>Title *</label><input name="title" required></div><div class="field"><label>Audience</label><select name="audience"><option>All</option><option>Parents</option><option>Teachers</option><option>Students</option></select></div><div class="field full"><label>Message</label><textarea name="body" rows="3" required></textarea></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Publish announcement',cls:'btn-primary',fn:()=>{ const f=new FormData($('#anf')); DB.announcements.unshift({id:uid('AN'),title:f.get('title'),body:f.get('body'),date:todayStr(),audience:f.get('audience'),pinned:false}); save(); toast('Announcement published ✅'); render(); }}]); }
function viewEvents(){
 const v=$('#view');
 v.innerHTML=`${crumb('Events & Calendar')}<div class="page-head"><div><h1>Events &amp; calendar</h1><p>School events, holidays and meetings for ${esc(DB.school.academicYear)}.</p></div><button class="btn btn-primary" onclick="eventForm()">＋ Add event</button></div>
 <div class="grid g2">${DB.events.map(e=>`<article class="card lift"><h3><span class="ci">${e.type==='Holiday'?'🌴':e.type==='Sports'?'⚽':e.type==='Meeting'?'🤝':'🎉'}</span>${esc(e.title)}</h3><p>${esc(e.desc)}</p><p>${pill(e.type,'pill-purple')} <small>${fmtDate(e.date)}</small></p></article>`).join('')}</div>`;
}
function eventForm(){ openModal('Add event',`<form id="ef" class="form-grid"><div class="field"><label>Title *</label><input name="title" required></div><div class="field"><label>Date</label><input name="date" type="date" value="${todayStr()}"></div><div class="field"><label>Type</label><select name="type"><option>Academic</option><option>Sports</option><option>Meeting</option><option>Holiday</option><option>Other</option></select></div><div class="field full"><label>Description</label><input name="desc"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Add event',cls:'btn-primary',fn:()=>{ const f=new FormData($('#ef')); DB.events.push({id:uid('EV'),title:f.get('title'),date:f.get('date')||todayStr(),type:f.get('type'),desc:f.get('desc')||''}); save(); toast('Event added ✅'); render(); }}]); }
function viewDiscipline(){ const v=$('#view'); v.innerHTML=`${crumb('Discipline')}<div class="page-head"><div><h1>Discipline &amp; behaviour</h1><p>Positive behaviour, incidents and follow-ups. Parents are notified in-app for incidents involving their child.</p></div><button class="btn btn-primary" onclick="disciplineForm()">＋ Add record</button></div><div class="card">${DB.discipline.map(d=>{ const s=studentById(d.studentId); return `<p><b>${esc(s?.name||'')}</b> — ${pill(d.type,d.type==='Positive'?'pill-green':'pill-amber')}<br>${esc(d.note)}<br><small>${fmtDate(d.date)} • by ${esc(d.by)}</small></p>`; }).join('')||emptyState('⚖️','No discipline records.')}</div>`; }
function disciplineForm(){ openModal('Add discipline record',`<form id="df" class="form-grid"><div class="field"><label>Student</label><select name="studentId">${DB.students.slice(0,12).map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div><div class="field"><label>Type</label><select name="type"><option>Positive</option><option>Warning</option><option>Incident</option></select></div><div class="field full"><label>Note *</label><textarea name="note" rows="3" required></textarea></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Save record',cls:'btn-primary',fn:()=>{ const f=new FormData($('#df')); DB.discipline.unshift({id:uid('D'),studentId:f.get('studentId'),type:f.get('type'),note:f.get('note'),date:todayStr(),by:currentUser().name}); save(); toast('Record saved ✅'); render(); }}]); }
function viewHealth(){ const v=$('#view'); const u=currentUser(); const allowed=u.role==='admin'||u.role==='teacher';
 v.innerHTML=`${crumb('Health')}<div class="page-head"><div><h1>Health &amp; medical records</h1><p>🔒 Restricted: only admin, class teachers and the school nurse can see medical notes.</p></div></div>
 ${allowed?`<div class="card">${DB.health.map(h=>{ const s=studentById(h.studentId); return `<p><b>${esc(s?.name||'')}</b><br>${esc(h.note)}<br><small>${fmtDate(h.date)} • ${esc(h.by)}</small></p>`; }).join('')}</div>`:`<div class="card">${emptyState('🔒','Medical records are restricted to authorised staff. Contact the school nurse or admin if you need help.')}</div>`}`; }
function viewInventory(){ const v=$('#view'); v.innerHTML=`${crumb('Inventory')}<div class="page-head"><div><h1>Inventory &amp; assets</h1><p>School furniture, equipment and stock.</p></div><button class="btn btn-primary" onclick="inventoryForm()">＋ Add item</button></div><div class="table-wrap"><table><tr><th>Item</th><th>Category</th><th>Quantity</th><th>Location</th></tr>${DB.inventory.map(i=>`<tr><td><b>${esc(i.item)}</b></td><td>${esc(i.category)}</td><td>${i.qty}</td><td>${esc(i.location)}</td></tr>`).join('')}</table></div>`; }
function inventoryForm(){ openModal('Add inventory item',`<form id="ivf" class="form-grid"><div class="field"><label>Item *</label><input name="item" required></div><div class="field"><label>Category</label><input name="category"></div><div class="field"><label>Quantity</label><input name="qty" type="number" value="1"></div><div class="field"><label>Location</label><input name="location"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Add item',cls:'btn-primary',fn:()=>{ const f=new FormData($('#ivf')); DB.inventory.push({id:uid('INV'),item:f.get('item'),category:f.get('category')||'General',qty:+f.get('qty')||1,location:f.get('location')||''}); save(); toast('Item added ✅'); render(); }}]); }
function viewCanteen(){ const v=$('#view'); v.innerHTML=`${crumb('Canteen')}<div class="page-head"><div><h1>Canteen</h1><p>Daily menu and prices in PKR.</p></div></div><div class="grid g4">${DB.canteen.map(c=>`<article class="card lift"><h3><span class="ci">🍽️</span>${esc(c.item)}</h3><p>${pill(c.category,'pill-amber')}</p><p class="num" style="font-size:1.2rem;font-weight:600">${PKR(c.price)}</p></article>`).join('')}</div><p class="hint" style="margin-top:14px">Online ordering and meal plans are a future module — the menu above is the live canteen list.</p>`; }

/* ---------------- Reports / Users / Settings ---------------- */
function viewReports(){
 const v=$('#view');
 const byClass=DB.classes.map(c=>{ const ss=DB.students.filter(s=>s.classId===c.id); const att=ss.length?Math.round(ss.reduce((a,s)=>a+attPct(s.id),0)/ss.length):0; return {c,ss,att}; });
 v.innerHTML=`${crumb('Reports & Analytics')}<div class="page-head"><div><h1>Reports &amp; analytics</h1><p>All figures are calculated live from the database — nothing is hard-coded.</p></div><div class="quick-actions"><button class="btn btn-ghost" onclick="exportStudents()">⬇ Students CSV</button><button class="btn btn-ghost" onclick="exportCSV('fees.csv',[['Invoice','Student','Amount','Paid','Status'],...DB.fees.map(f=>[f.id,(studentById(f.studentId)||{}).name||'',f.amount,f.paid,f.status])])">⬇ Fees CSV</button><button class="btn btn-ghost" onclick="window.print()">🖨️ Print report</button></div></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">🧑‍🎓</span>Class strength &amp; attendance</h3>${byClass.map(x=>barRow(x.c.name+'-'+x.c.section,x.att,x.ss.length+' students • '+x.att+'%')).join('')}</section>
 <section class="card"><h3><span class="ci">💰</span>Fee summary</h3>${barRow('Collected',Math.round(DB.fees.reduce((a,f)=>a+f.paid,0)/Math.max(1,DB.fees.reduce((a,f)=>a+f.amount,0))*100),PKR(DB.fees.reduce((a,f)=>a+f.paid,0)),'green')}${barRow('Outstanding',Math.round(DB.fees.reduce((a,f)=>a+(f.amount-f.paid),0)/Math.max(1,DB.fees.reduce((a,f)=>a+f.amount,0))*100),PKR(DB.fees.reduce((a,f)=>a+(f.amount-f.paid),0)),'orange')}<p>Admissions this term: <b>${DB.admissions.length}</b> • Books issued: <b>${DB.issues.filter(i=>!i.returned).length}</b> • Library books: <b>${DB.books.length}</b> titles</p></section></div>`;
}
function viewUsers(){
 const v=$('#view');
 v.innerHTML=`${crumb('Users & Permissions')}<div class="page-head"><div><h1>Users &amp; permissions</h1><p>Role-based access is enforced in every portal. Parents see only their children; teachers see only their classes.</p></div></div>
 <div class="table-wrap"><table><tr><th>User</th><th>Email</th><th>Role</th><th>Access</th><th>Status</th></tr>${DB.users.map(u=>`<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td>${pill(u.role,'pill-purple')}</td><td>${esc(u.title||'')}</td><td>${statusPill('Active')}</td></tr>`).join('')}</table></div>
 <div class="card" style="margin-top:16px"><h3><span class="ci">📜</span>Audit log</h3>${DB.audit.slice(0,8).map(a=>`<p><small>${esc(a.date)}</small> — <b>${esc(a.by)}</b>: ${esc(a.action)}</p>`).join('')||emptyState('📜','No activity yet.')}</div>`;
}
function viewSettings(){
 const v=$('#view'); const s=DB.school;
 v.innerHTML=`${crumb('Settings')}<div class="page-head"><div><h1>Settings</h1><p>School profile, branding, academic year and preferences.</p></div></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">🏫</span>School profile</h3><form id="setf" class="form-grid"><div class="field"><label>School name</label><input name="name" value="${esc(s.name)}"></div><div class="field"><label>Phone</label><input name="phone" value="${esc(s.phone)}"></div><div class="field full"><label>Address</label><input name="address" value="${esc(s.address)}"></div><div class="field"><label>Email</label><input name="email" value="${esc(s.email)}"></div><div class="field"><label>Academic year</label><input name="academicYear" value="${esc(s.academicYear)}"></div><div class="field"><label>Currency</label><select name="currency"><option ${s.currency==='PKR'?'selected':''}>PKR</option><option>USD</option></select></div><div class="field"><label>Language</label><select name="language"><option ${s.language==='English'?'selected':''}>English</option><option ${s.language==='Urdu'?'selected':''}>Urdu</option></select></div></form><button class="btn btn-primary" onclick="saveSettings()">💾 Save settings</button></section>
 <section class="card tint-grey"><h3><span class="ci">⚙️</span>Academic &amp; notification settings</h3><div class="kv"><dt>Grading</dt><dd>${esc(DB.settings.grading)}</dd><dt>Attendance rule</dt><dd>${esc(DB.settings.attendanceRule)}</dd><dt>Working days</dt><dd>${esc(DB.settings.workingDays)}</dd><dt>Timings</dt><dd>${esc(DB.settings.timings)}</dd></div>
 <h3 style="margin-top:16px"><span class="ci">🔔</span>Integrations — requires configuration</h3><p class="muted">Email (SMTP), SMS, WhatsApp and payment gateways are <b>integration-ready only</b>. Add provider credentials here in the production backend — this demo never pretends they are connected. See docs/BACKEND.md.</p>
 <button class="btn btn-ghost" onclick="resetDemo()">↺ Reset demo data</button></section></div>`;
}
function saveSettings(){ const f=new FormData($('#setf')); Object.assign(DB.school,{name:f.get('name'),phone:f.get('phone'),address:f.get('address'),email:f.get('email'),academicYear:f.get('academicYear'),currency:f.get('currency'),language:f.get('language')}); save(); toast('Settings saved ✅'); render(); }

/* ---------------- Teacher / Student / Parent views ---------------- */
function viewMyClasses(u){
 const v=$('#view'); const list=myClasses();
 v.innerHTML=`${crumb('My Classes')}<div class="page-head"><div><h1>My classes</h1><p>Your assigned classes and their students.</p></div></div>
 <div class="grid g2">${list.map(c=>{ const ss=DB.students.filter(s=>s.classId===c.id); return `<article class="card lift"><h3><span class="ci">🏫</span>${c.name}-${c.section}</h3><p>Room ${esc(c.room)} • ${ss.length} students • Class teacher: ${esc((teacherById(c.teacherId)||{}).name||'—')}</p>${ss.slice(0,5).map(s=>`<p>• ${esc(s.name)} — Roll ${s.roll} • ${attPct(s.id)}% attendance</p>`).join('')}<button class="btn btn-ghost btn-sm" onclick="go('attendance')">Mark attendance →</button></article>`; }).join('')||emptyState('🏫','No classes assigned yet.')}</div>`;
}
function viewProgress(u){
 const v=$('#view'); const kids=u.role==='parent'?myStudents():u.role==='teacher'?DB.students.filter(s=>myClasses().some(c=>c.id===s.classId)):myStudents();
 const sel=routeParam||kids[0]?.id; const s=studentById(sel)||kids[0];
 v.innerHTML=`${crumb('Student Progress')}<div class="page-head"><div><h1>Student progress</h1><p>Attendance, marks and homework in one place.</p></div></div>
 ${kids.length>1?`<div class="child-switch">${kids.map(k=>`<button class="${s&&k.id===s.id?'active':''}" onclick="go('progress','${k.id}')"><b>${esc(k.name)}</b><br><small>${classLabel(k.classId)}</small></button>`).join('')}</div>`:''}
 ${s?`<div class="grid g4" style="margin-bottom:16px">${statCard('✅','ic-green',attPct(s.id)+'%','Attendance','')}${statCard('📋','ic-purple',(studentAvg(s.id)??'—')+'%','Midterm average','')}${statCard('📚','ic-blue',DB.homework.filter(h=>h.classId===s.classId).length,'Homework tasks','')}${statCard('💰','ic-amber',PKR(feeBalance(s.id)),'Fee balance','')}</div>
 <div class="card"><h3><span class="ci">📋</span>Midterm marks — ${esc(s.name)}</h3><div class="table-wrap"><table><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>${DB.marks.filter(m=>m.studentId===s.id).map(m=>`<tr><td>${esc(m.subject)}</td><td>${m.obtained}/${m.total}</td><td>${pill(GRADE(m.obtained/m.total*100),gradePill(GRADE(m.obtained/m.total*100)))}</td></tr>`).join('')}</table></div><div class="quick-actions" style="margin-top:14px"><button class="btn btn-primary" onclick="showReportCard('${s.id}')">🖨️ Print report card</button></div></div>` : emptyState('🧑‍🎓','No student selected.')}`;
}
function viewMessages(u){
 const v=$('#view');
 v.innerHTML=`${crumb('Messages')}<div class="page-head"><div><h1>Messages</h1><p>School messages and announcements in one inbox.</p></div><button class="btn btn-primary" onclick="messageForm()">✉️ New message</button></div>
 <div class="card">${DB.messages.map(m=>`<article style="padding:12px 0;border-bottom:1px solid #f1f5f9"><p><b>${esc(m.subject)}</b> ${m.read?'':pill('New','pill-pink')}<br><small>From ${esc(m.from)} → ${esc(m.to)} • ${fmtDate(m.date)}</small></p><p>${esc(m.body)}</p></article>`).join('')||emptyState('💬','No messages yet.')}</div>`;
}
function messageForm(){ openModal('New message',`<form id="mf" class="form-grid"><div class="field"><label>To</label><select name="to"><option>Admin</option><option>All Teachers</option><option>Class Teacher</option></select></div><div class="field"><label>Subject *</label><input name="subject" required></div><div class="field full"><label>Message</label><textarea name="body" rows="3" required></textarea></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Send message',cls:'btn-primary',fn:()=>{ const f=new FormData($('#mf')); DB.messages.unshift({id:uid('M'),from:currentUser().name,to:f.get('to'),subject:f.get('subject'),body:f.get('body'),date:todayStr(),read:true,role:currentUser().role}); save(); toast('Message sent ✅'); render(); }}]); }
function viewLeave(){
 const v=$('#view');
 v.innerHTML=`${crumb('Leave')}<div class="page-head"><div><h1>Leave management</h1><p>Apply for leave and track approvals.</p></div><button class="btn btn-primary" onclick="leaveForm()">＋ Apply for leave</button></div>
 <div class="table-wrap"><table><tr><th>Name</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th></th></tr>${DB.leaves.map(l=>`<tr><td>${esc(l.name)}</td><td>${fmtDate(l.from)}</td><td>${fmtDate(l.to)}</td><td>${esc(l.reason)}</td><td>${statusPill(l.status)}</td><td>${currentUser().role==='admin'&&l.status==='Pending'?`<button class="btn btn-primary btn-sm" onclick="setLeave('${l.id}','Approved')">Approve</button> <button class="btn btn-danger btn-sm" onclick="setLeave('${l.id}','Rejected')">Reject</button>`:''}</td></tr>`).join('')}</table></div>`;
}
function setLeave(id,st){ DB.leaves.find(l=>l.id===id).status=st; save(); toast('Leave '+st.toLowerCase()+' ✅'); render(); }
function leaveForm(){ openModal('Apply for leave',`<form id="lvf" class="form-grid"><div class="field"><label>From</label><input name="from" type="date" value="${todayStr()}"></div><div class="field"><label>To</label><input name="to" type="date" value="${todayStr()}"></div><div class="field full"><label>Reason *</label><input name="reason" required></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Submit application',cls:'btn-primary',fn:()=>{ const f=new FormData($('#lvf')); DB.leaves.unshift({id:uid('LV'),name:currentUser().name,role:currentUser().role,from:f.get('from'),to:f.get('to'),reason:f.get('reason'),status:'Pending'}); save(); toast('Leave application submitted ✅'); render(); }}]); }
function viewProfile(u){
 const v=$('#view');
 const extra=u.role==='student'?studentById(u.studentId):u.role==='teacher'?teacherById(u.teacherId):u.role==='parent'?parentById(u.parentId):null;
 v.innerHTML=`${crumb('Profile')}<div class="page-head"><div><h1>${esc(u.name)}</h1><p>${esc(u.title||u.role)} • ${esc(u.email)}</p></div></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">👤</span>Profile</h3><div class="kv"><dt>Name</dt><dd>${esc(u.name)}</dd><dt>Email</dt><dd>${esc(u.email)}</dd><dt>Role</dt><dd>${esc(u.role)}</dd>${extra&&extra.phone?`<dt>Phone</dt><dd>${esc(extra.phone)}</dd>`:''}${extra&&extra.classId?`<dt>Class</dt><dd>${classLabel(extra.classId)} • Roll ${extra.roll}</dd>`:''}${extra&&extra.subject?`<dt>Subject</dt><dd>${esc(extra.subject)}</dd>`:''}</div></section>
 <section class="card"><h3><span class="ci">🔐</span>Account</h3><p>Change password, notification preferences and language.</p><div class="quick-actions"><button class="btn btn-ghost" onclick="openModal('Change password','<div class=field><label>New password</label><input type=password id=npw></div>',[{label:'Cancel',cls:'btn-ghost'},{label:'Save',cls:'btn-primary',fn:()=>{ const p=$('#npw').value; if(p.length<6){toast('Password must be at least 6 characters.' ,'err');return false;} u.password=p; save(); toast('Password changed ✅'); }}])">Change password</button><button class="btn btn-ghost" onclick="setLang(LANG==='en'?'ur':'en')">🌐 ${LANG==='en'?'Switch to اردو':'Switch to English'}</button><button class="btn btn-ghost" onclick="toggleTheme();render()">🌙 Toggle dark mode</button></div><p class="hint" style="margin-top:12px">Two-factor authentication and login-activity alerts are part of the production backend plan (docs/BACKEND.md) — not active in this local demo.</p></section></div>`;
}
function viewChildren(u){
 const v=$('#view'); const kids=myStudents();
 v.innerHTML=`${crumb('My Children')}<div class="page-head"><div><h1>My children</h1><p>${kids.length} child(ren) enrolled at ${esc(DB.school.name)}.</p></div></div>
 <div class="grid g2">${kids.map(k=>`<article class="card lift"><h3><span class="ci">🧑‍🎓</span>${esc(k.name)}</h3><div class="kv"><dt>Class</dt><dd>${classLabel(k.classId)} • Roll ${k.roll}</dd><dt>Attendance</dt><dd>${attPct(k.id)}%</dd><dt>Average</dt><dd>${studentAvg(k.id)??'—'}%</dd><dt>Fee balance</dt><dd>${PKR(feeBalance(k.id))}</dd></div><div class="quick-actions" style="margin-top:12px"><button class="btn btn-primary btn-sm" onclick="childSel='${k.id}';go('dashboard')">View dashboard →</button><button class="btn btn-ghost btn-sm" onclick="go('progress','${k.id}')">Progress</button><button class="btn btn-ghost btn-sm" onclick="go('fees')">Fees</button></div></article>`).join('')}</div>`;
}
function viewMeetings(){
 const v=$('#view');
 v.innerHTML=`${crumb('Parent Meetings')}<div class="page-head"><div><h1>Parent–teacher meetings</h1><p>Schedule, request and track meetings with teachers.</p></div><button class="btn btn-primary" onclick="meetingForm()">＋ Request a meeting</button></div>
 <div class="table-wrap"><table><tr><th>Parent</th><th>Teacher</th><th>Date</th><th>Time</th><th>Topic</th><th>Status</th></tr>${DB.meetings.map(m=>`<tr><td>${esc(m.parent)}</td><td>${esc(m.teacher)}</td><td>${fmtDate(m.date)}</td><td>${esc(m.time)}</td><td>${esc(m.topic)}</td><td>${statusPill(m.status)}</td></tr>`).join('')}</table></div>`;
}
function meetingForm(){ openModal('Request a meeting',`<form id="mtf" class="form-grid"><div class="field"><label>Teacher</label><select name="teacher">${DB.teachers.slice(0,5).map(t=>`<option>${esc(t.name)}</option>`).join('')}</select></div><div class="field"><label>Date</label><input name="date" type="date" value="2026-11-28"></div><div class="field"><label>Time</label><input name="time" value="10:00 AM"></div><div class="field"><label>Topic</label><input name="topic"></div></form>`,[{label:'Cancel',cls:'btn-ghost'},{label:'Send request',cls:'btn-primary',fn:()=>{ const f=new FormData($('#mtf')); DB.meetings.push({id:uid('MT'),parent:currentUser().name,teacher:f.get('teacher'),date:f.get('date'),time:f.get('time'),topic:f.get('topic')||'General',status:'Scheduled'}); save(); toast('Meeting requested ✅'); render(); }}]); }
function viewDocuments(u){
 const v=$('#view'); const s=u.role==='student'?studentById(u.studentId):myStudents()[0];
 v.innerHTML=`${crumb('Documents')}<div class="page-head"><div><h1>Documents</h1><p>ID cards, certificates and receipts — print-ready.</p></div></div>
 <div class="grid g2"><section class="card"><h3><span class="ci">🪪</span>Student ID card</h3>${s?`<div class="id-card"><div class="id-head"><b>${esc(DB.school.name)}</b><br><small>Student Identity Card • ${esc(DB.school.academicYear)}</small></div><div class="id-body"><div style="font-size:2.4rem">🧑‍🎓</div><h3>${esc(s.name)}</h3><p>${s.id} • ${esc(s.admissionNo)}<br>${classLabel(s.classId)} • Roll ${s.roll}<br>Blood: ${esc(s.blood||'—')}</p></div></div><div class="quick-actions" style="margin-top:14px"><button class="btn btn-primary" onclick="printIDCard(DB.students.find(x=>x.id==='${s.id}'))">🖨️ Print ID card</button></div>`:'No student found.'}</section>
 <section class="card"><h3><span class="ci">📜</span>Certificates &amp; receipts</h3><div class="quick-actions" style="flex-direction:column;align-items:stretch"><button class="btn btn-ghost" onclick="showReportCard('${s?.id||''}')">📋 Report card (Midterm 2026)</button><button class="btn btn-ghost" onclick="printSection('<h1>${esc(DB.school.name)}</h1><p>Bonafide Certificate</p><p>This is to certify that <b>${esc(s?.name||'')}</b> is a bonafide student of ${classLabel(s?.classId||'')} at ${esc(DB.school.name)}.</p><p>Principal: ________________</p>','Bonafide Certificate')">📜 Bonafide certificate</button><button class="btn btn-ghost" onclick="go('fees')">🧾 Fee receipts</button></div><p class="hint">Character, transfer and school-leaving certificates use the same print layout — ask admin to issue one from the student profile.</p></section></div>`;
}

/* ---------------- init ---------------- */
document.addEventListener('DOMContentLoaded',()=>{ if(localStorage.getItem('sms_theme')==='dark') document.body.classList.add('dark'); document.documentElement.lang=LANG; document.documentElement.dir=LANG==='ur'?'rtl':'ltr'; render(); });
render();
