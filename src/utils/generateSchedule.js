import { days, hours, physicalLessonHours } from "../data/classrooms";

function addOneHour(hour) {
  const [hourPart, minutePart] = hour.split(":").map(Number);
  const nextHour = hourPart + 1;

  return `${String(nextHour).padStart(2, "0")}:${String(minutePart).padStart(
    2,
    "0"
  )}`;
}

function getEndHour(startIndex, blockLength) {
  const endIndex = startIndex + blockLength;

  if (hours[endIndex]) {
    return hours[endIndex];
  }

  return addOneHour(hours[hours.length - 1]);
}

function canPlaceBlock({ course, day, startIndex, blockLength, occupiedSlots }) {
  if (course.unavailableDays?.includes(day)) {
    return false;
  }

  const blockHours = hours.slice(startIndex, startIndex + blockLength);

  if (blockHours.length < blockLength) {
    return false;
  }

  const isOnlineCourse = course.classroomGroup === "online";

  if (!isOnlineCourse) {
    const isPhysicalHourAvailable = blockHours.every((hour) =>
      physicalLessonHours.includes(hour)
    );

    if (!isPhysicalHourAvailable) {
      return false;
    }
  }

  for (const hour of blockHours) {
    if (course.unavailableHours?.includes(hour)) {
      return false;
    }

    const slotKey = `${day}-${hour}`;

    if (occupiedSlots[slotKey]) {
      return false;
    }
  }

  return true;
}

function placeCourseBlocks(course, occupiedSlots) {
  const blocks = course.blocks?.length ? course.blocks : [course.weeklyHours];
  const tempOccupiedSlots = { ...occupiedSlots };
  const tempPlacements = [];
  const placedDays = [];

  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const blockLength = blocks[blockIndex];
    let placedBlock = null;

    for (const day of days) {
      if (course.preventSameDayBlocks && placedDays.includes(day)) {
        continue;
      }

      for (
        let startIndex = 0;
        startIndex <= hours.length - blockLength;
        startIndex++
      ) {
        const canPlace = canPlaceBlock({
          course,
          day,
          startIndex,
          blockLength,
          occupiedSlots: tempOccupiedSlots,
        });

        if (!canPlace) continue;

        const blockHours = hours.slice(startIndex, startIndex + blockLength);
        const startHour = hours[startIndex];
        const endHour = getEndHour(startIndex, blockLength);

        const blockId = `${course.id}-${blockIndex}-${Date.now()}-${Math.random()}`;

        const placement = {
          blockId,
          courseId: course.id,

          courseCode: course.courseCode,
          courseName: course.name,

          instructor: course.instructor,
          classGroup: course.classGroup,

          classroomGroup: course.classroomGroup,
          classroomGroupLabel: course.classroomGroupLabel,
          classroom: course.classroom,

          day,
          startHour,
          endHour,
          blockHours,
          blockLength,
          blockIndex: blockIndex + 1,
          totalBlocks: blocks.length,
        };

        for (const hour of blockHours) {
          const slotKey = `${day}-${hour}`;

          tempOccupiedSlots[slotKey] = {
            ...placement,
            currentHour: hour,
            isStart: hour === startHour,
          };
        }

        tempPlacements.push(placement);
        placedDays.push(day);
        placedBlock = placement;
        break;
      }

      if (placedBlock) break;
    }

    if (!placedBlock) {
      return {
        success: false,
        placements: [],
        occupiedSlots,
        reason: `${course.courseCode || course.name} dersinin ${blockLength} saatlik bloğu için uygun yer bulunamadı.`,
      };
    }
  }

  return {
    success: true,
    placements: tempPlacements,
    occupiedSlots: tempOccupiedSlots,
  };
}

export function generateSchedule(courses) {
  let occupiedSlots = {};
  const placements = [];
  const unplacedCourses = [];
  const logs = [];

  const sortedCourses = [...courses].sort((a, b) => {
    const aConstraintCount =
      (a.unavailableDays?.length || 0) + (a.unavailableHours?.length || 0);

    const bConstraintCount =
      (b.unavailableDays?.length || 0) + (b.unavailableHours?.length || 0);

    const aBlockCount = a.blocks?.length || 1;
    const bBlockCount = b.blocks?.length || 1;

    return (
      bConstraintCount - aConstraintCount ||
      b.weeklyHours - a.weeklyHours ||
      bBlockCount - aBlockCount
    );
  });

  for (const course of sortedCourses) {
    const result = placeCourseBlocks(course, occupiedSlots);

    if (result.success) {
      occupiedSlots = result.occupiedSlots;
      placements.push(...result.placements);

      logs.push({
        type: "success",
        message: `${course.courseCode || course.name} dersi programa yerleştirildi.`,
      });
    } else {
      unplacedCourses.push({
        ...course,
        reason: result.reason,
      });

      logs.push({
        type: "error",
        message: result.reason,
      });
    }
  }

  return {
    placements,
    occupiedSlots,
    unplacedCourses,
    logs,
    generatedAt: new Date().toLocaleString("tr-TR"),
  };
}