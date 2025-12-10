import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tasks from '../Tasks/Tasks';
import Solutions from "../Solutions/Solutions";

const Course = () => {
    const { courseId } = useParams();


    return (
        <div>
            <Tasks courseId={courseId} />
            <Solutions courseId={courseId} />
        </div>
    );
};

export default Course;
