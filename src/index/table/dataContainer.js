// Function to create a teacher container
export function createTeacherContainer(teachers, originalTeachers = []) {
    const container = document.createElement('span');
    container.classList.add('lesson-teacher');

    function appendTeacherData(teacher, isOriginal = false) {
        const teacherItem = document.createElement('span');

        const teacherPronoun = document.createElement('span');
        teacherPronoun.classList.add('pronoun');
        teacherPronoun.textContent = teacher.pronoun;
        teacherItem.appendChild(teacherPronoun);

        const teacherTitle = document.createElement('span');
        teacherTitle.classList.add('title');
        teacherTitle.textContent = teacher.title;
        teacherItem.appendChild(teacherTitle);

        const teacherForename = document.createElement('span');
        teacherForename.classList.add('forename');
        teacherForename.textContent = teacher.firstName;
        teacherItem.appendChild(teacherForename);

        const teacherName = document.createElement('span');
        teacherName.classList.add('long');
        teacherName.textContent = teacher.name;
        teacherItem.appendChild(teacherName);

        const teacherShortName = document.createElement('span');
        teacherShortName.classList.add('short');
        teacherShortName.textContent = teacher.shortName;
        teacherItem.appendChild(teacherShortName);

        if (isOriginal) teacherItem.classList.add('originalData');

        container.appendChild(teacherItem);
    }

    teachers.forEach(teacher => appendTeacherData(teacher));
    originalTeachers.forEach(teacher => appendTeacherData(teacher, true));

    return container;
}

// Function to create a room container
export function createRoomContainer(rooms, originalRooms = []) {
    const container = document.createElement('span');
    container.classList.add('lesson-room');

    function appendRoomData(room, isOriginal = false) {
        const roomItem = document.createElement('span');

        const roomName = document.createElement('span');
        roomName.classList.add('name');
        roomName.textContent = room.name;
        roomItem.appendChild(roomName);

        if (room.additionalInformation) {
            const roomInfo = document.createElement('span');
            roomInfo.classList.add('info');
            roomInfo.textContent = room.additionalInformation;
            roomItem.appendChild(roomInfo);
        }

        if (isOriginal) roomItem.classList.add('originalData');

        container.appendChild(roomItem);
    }

    rooms.forEach(room => appendRoomData(room));
    originalRooms.forEach(room => appendRoomData(room, true));

    return container;
}

// Function to create a class container
export function createClassContainer(classes, originalClasses = []) {
    const container = document.createElement('span');
    container.classList.add('lesson-class');

    function appendClassData(_class, isOriginal = false) {
        const classItem = document.createElement('span');
        classItem.textContent = _class.name;

        if (isOriginal) classItem.classList.add('originalData');

        container.appendChild(classItem);
    }

    classes.forEach(_class => appendClassData(_class));
    originalClasses.forEach(_class => appendClassData(_class, true));

    return container;
}

// Function to create a class container
export function createSubjectContainer(subjects, originalSubjects = []) {
    const container = document.createElement('span');
    container.classList.add('lesson-subject');

    function appendClassData(subject, isOriginal = false) {
        const subjectItem = document.createElement('span');

        const subjectItemLong = document.createElement('span');
        subjectItemLong.classList.add('long');
        subjectItemLong.textContent = subject.name;
        subjectItem.appendChild(subjectItemLong);
        const subjectItemShort = document.createElement('span');
        subjectItemShort.classList.add('short');
        subjectItemShort.textContent = subject.shortName;
        subjectItem.appendChild(subjectItemShort);

        if (isOriginal) subjectItem.classList.add('originalData');

        container.appendChild(subjectItem);
    }

    subjects.forEach(subject => appendClassData(subject));
    originalSubjects.forEach(subject => appendClassData(subject, true));

    return container;
}