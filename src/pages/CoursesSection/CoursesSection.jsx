import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {     Delete as DeleteIcon,
    School as SchoolIcon} from '@mui/icons-material';
import styles from './CoursesSection.module.css';

const CoursesSection = ({
                            courses,
                            onDeleteCourse,
                            isLoading,
                            noCoursesMessage = 'Нет общих курсов'
                        }) => {
    if (courses.length === 0) {
        return (
            <Typography
                variant="body2"
                color="textSecondary"
                className={styles.noCoursesMessage}
            >
                {noCoursesMessage}
            </Typography>
        );
    }

    return (
        <div className={styles.coursesSection}>
            <div className={styles.coursesContainer}>
                {courses.map(course => (
                    <div key={course.id} className={styles.courseItem}>
                        <SchoolIcon
                            color={"primary"}
                            fontSize="small"
                            sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" className={styles.courseName}>
                            {course.name || 'Без названия'}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ ml: 1, mr: 1 }}
                        >
                            Создатель: {course.creator?.name || 'Неизвестен'}
                        </Typography>
                        <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={() => onDeleteCourse(course.id)}
                            disabled={isLoading}
                            sx={{
                                minWidth: 'auto',
                                padding: '0 4px',
                                marginLeft: '8px'
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesSection;
