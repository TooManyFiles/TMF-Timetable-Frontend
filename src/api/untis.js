import { setErrorDisplay } from '../generic/errorDisplay.js';
import { API_URL } from '../config.js';
import { timeToSchoolTimeGrid, getOneLetterDayCode } from '../utils/utils.js';


export async function getAllSubjects() {
  const url = `${API_URL}untis/subjects`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include"
    });

    if (response.status === 200) {
      const subjects = await response.json();
      console.log('List of subjects:', subjects);
      return subjects;
    } else if (response.status === 401) {
      console.error('Unauthorized - Authentication required');
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}


export async function getAllTeachers() {
  const url = `${API_URL}untis/teachers`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include"
    });

    if (response.status === 200) {
      const teachers = await response.json();
      console.log('List of teachers:', teachers);
      return teachers;
    } else if (response.status === 401) {
      console.error('Unauthorized - Authentication required');
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}


export async function getAllClasses() {
  const url = `${API_URL}untis/classes`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include"
    });

    if (response.status === 200) {
      const classes = await response.json();
      console.log('List of classes:', classes);
      return classes;
    } else if (response.status === 401) {
      console.error('Unauthorized - Authentication required');
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

async function getAllRooms() {
  const url = `${API_URL}untis/rooms`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include"
    });

    if (response.status === 200) {
      const rooms = await response.json();
      console.log('List of rooms:', rooms);
      return rooms;
    } else if (response.status === 401) {
      console.error('Unauthorized - Authentication required');
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

export async function fetchStaticData() {
  const url = `${API_URL}untis/fetch`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include"
    });

    if (response.status === 200) {
      console.log('Successfully fetched static data.');
      return await response.json();
    } else if (response.status === 401) {
      console.error('Unauthorized - Authentication required');
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
export async function getStaticData() {
  let rooms = localStorage.getItem('rooms');
  if (rooms && rooms != "undefined") {
    rooms = JSON.parse(rooms);
  } else {
    rooms = await getAllRooms();
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }
  let teachers = localStorage.getItem('teachers');
  if (teachers && teachers != "undefined") {
    teachers = JSON.parse(teachers);
  } else {
    teachers = await getAllTeachers();
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }
  let classes = localStorage.getItem('classes');
  if (classes && classes != "undefined") {
    classes = JSON.parse(classes);
  } else {
    classes = await getAllClasses();
    localStorage.setItem('classes', JSON.stringify(classes));
  }
  let subjects = localStorage.getItem('subjects');
  if (subjects && subjects != "undefined") {
    subjects = JSON.parse(subjects);
  } else {
    subjects = await getAllSubjects();
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }
  return { rooms: rooms, teachers: teachers, classes: classes, subjects: subjects };
}
function sort(array) {
  if (array.length >=2) debugger
  return array.slice().sort((a, b) => Number(a) - Number(b));
}
export async function parseLessons(lessons) {
  let staticData = await getStaticData()
  console.log(staticData)
  //TODO: better accounting for timezone
  const parsedLessons = lessons.map(lesson => ({
    id: lesson.id,
    subjects: staticData.subjects.filter(subjectA =>
      (lesson.subjects || []).some(subject => subject === subjectA.id)
    ),
    teachers: staticData.teachers.filter(teacherA =>
      (lesson.teachers || []).some(teacher => teacher === teacherA.id)
    ),
    rooms: staticData.rooms.filter(roomA =>
      (lesson.rooms || []).some(room => room === roomA.id)
    ),
    classes: staticData.classes.filter(classA =>
      (lesson.classes || []).some(classB => classB === classA.id)
    ),
    originalSubjects: staticData.subjects.filter(subjectA =>
      (lesson.origSubjects || []).some(subject => subject === subjectA.id)
    ),
    originalTeachers: staticData.teachers.filter(teacherA =>
      (lesson.origTeachers || []).some(teacher => teacher === teacherA.id)
    ),
    originalRooms: staticData.rooms.filter(roomA =>
      (lesson.origRooms || []).some(room => room === roomA.id)
    ),
    originalClasses: staticData.classes.filter(classA =>
      (lesson.origClasses || []).some(classB => classB === classA.id)
    ),
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    row: timeToSchoolTimeGrid(lesson.startTime).name - 0,
    day: getOneLetterDayCode(lesson.startTime),
    cancelled: lesson.cancelled || '',
    irregular: lesson.irregular || '',
    additionalInformation: lesson.additionalInformation || '',
    substitutionText: lesson.substitutionText || '',
    lessonText: lesson.lessonText || '',
    bookingText: lesson.bookingText || '',
    homework: lesson.homework || '',
    lastUpdate: lesson.lastUpdate || '',
    chairUp: lesson.chairUp || '',

    value: sort(lesson.subjects || []).join("") + sort(lesson.teachers || []).join("") + sort(lesson.rooms || []).join("") + sort(lesson.classes || []).join("") + (lesson.cancelled?1:0) + (lesson.description || '')
  }));

  localStorage.setItem('lessons', JSON.stringify(parsedLessons));
}