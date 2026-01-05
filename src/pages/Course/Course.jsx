import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tasks from '../Tasks/Tasks';
import Solutions from "../Solutions/Solutions";
import UsersCourse from "../UsersCourse/UsersCourse";

const Course = () => {
    const { courseId } = useParams();


    return (
        <div>
            <UsersCourse courseId={courseId}/>
            <Tasks courseId={courseId} />
            <Solutions courseId={courseId} />
        </div>
    );
};

export default Course;
