// src/components/CourseList.jsx
import React from 'react';

function CourseList({ courses }) {
    return (
        <div id="course-list">
            {courses.map((course, index) => (
                <div className="course-card" key={index}>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <a href={course.youtubeLink} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
                </div>
            ))}
        </div>
    );
}

export default CourseList;
