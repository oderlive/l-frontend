import React, { useState } from 'react';
import {
    TableRow,
    TableCell,
    Button,
    IconButton,
    Typography,
    Box,
    Collapse,
    List,
    ListItem,
    ListItemText,
    TextField,
    InputAdornment,
    Alert,
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Delete as DeleteIcon,
    AddComment as AddCommentIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import {
    selectTaskComments,
    selectCommentsLoading,
    selectCommentsError,
} from '../../features/comments/commentsSlice';
import {
    getTaskComments,
    addTaskComment,
    deleteTaskComment,
} from '../../features/comments/comments';
import {
    getTaskFile,
    downloadTaskZip,
} from '../../features/tasks/tasks';

const TaskItem = ({ task, onEdit, onDelete, onAddSolution }) => {
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');

    const comments = useSelector((state) =>
        selectTaskComments(state, task.id)
    );
    const isLoadingComments = useSelector(selectCommentsLoading);
    const errorComments = useSelector(selectCommentsError);

    // ===== COMMENTS =====
    const handleToggle = async () => {
        if (!expanded) {
            setExpanded(true);
            try {
                await dispatch(getTaskComments(task.id)).unwrap();
            } catch (err) {
                console.error(err);
            }
        } else {
            setExpanded(false);
            setCommentText('');
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            await dispatch(
                addTaskComment({
                    taskId: task.id,
                    commentData: { text: commentText.trim() },
                })
            ).unwrap();
            setCommentText('');
        } catch (err) {
            console.error('Ошибка при добавлении комментария:', err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Удалить комментарий?')) return;

        try {
            await dispatch(
                deleteTaskComment({ taskId: task.id, commentId })
            ).unwrap();
        } catch (err) {
            console.error('Ошибка при удалении комментария:', err);
        }
    };

    // ===== FILES =====
    const handleViewFile = async (fileId) => {
        try {
            const res = await dispatch(
                getTaskFile({
                    taskId: task.id,
                    fileId,
                    download: false,
                })
            ).unwrap();

            const url = URL.createObjectURL(res.data);
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Ошибка просмотра файла:', err);
        }
    };

    const handleDownloadFile = async (fileId, name) => {
        try {
            const res = await dispatch(
                getTaskFile({
                    taskId: task.id,
                    fileId,
                    download: true,
                })
            ).unwrap();

            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = name || 'file';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Ошибка скачивания файла:', err);
        }
    };

    const handleDownloadZip = async () => {
        try {
            const res = await dispatch(downloadTaskZip(task.id)).unwrap();

            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `task_${task.id}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Ошибка скачивания ZIP:', err);
        }
    };

    return (
        <>
            {/* ===== MAIN ROW ===== */}
            <TableRow hover>
                <TableCell>{task.id}</TableCell>

                <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                        {task.title}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {task.description || '—'}
                    </Typography>
                </TableCell>

                <TableCell>
                    {task.to_submit_at
                        ? new Date(task.to_submit_at).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : '—'}
                </TableCell>

                <TableCell>{task.is_assessed ? '✅' : '❌'}</TableCell>
                <TableCell>{task.is_for_everyone ? '✅' : '❌'}</TableCell>

                <TableCell align="center">
                    <Typography variant="body2" fontWeight="bold" color="primary">
                        {task.content?.length || 0}
                    </Typography>
                </TableCell>

                <TableCell align="center">
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                            comments?.length > 0
                                ? 'success.main'
                                : 'text.secondary'
                        }
                    >
                        {comments !== undefined ? comments.length : '...'}
                    </Typography>
                </TableCell>

                <TableCell align="right">
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onEdit(task)}
                        sx={{ mr: 1 }}
                    >
                        Редактировать
                    </Button>

                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => onDelete(task.id)}
                        sx={{ mr: 1 }}
                    >
                        Удалить
                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onAddSolution(task)}
                        sx={{ mr: 1 }}
                    >
                        Решение
                    </Button>

                    <IconButton
                        size="small"
                        onClick={handleToggle}
                        color="primary"
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* ===== DETAILS ===== */}
            <TableRow>
                <TableCell colSpan={9} sx={{ py: 0, borderBottom: 'none' }}>
                    <Collapse in={expanded} timeout="auto">
                        <Box
                            sx={{
                                m: 2,
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                            }}
                        >
                            {/* ===== FILES (ALWAYS VISIBLE) ===== */}
                            <Typography variant="subtitle2" gutterBottom>
                                📎 Файлы задания
                            </Typography>

                            {task.content?.length > 0 ? (
                                <>
                                    <List dense>
                                        {task.content.map((file) => (
                                            <ListItem
                                                key={file.id}
                                                secondaryAction={
                                                    <>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleViewFile(file.id)
                                                            }
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>

                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleDownloadFile(
                                                                    file.id,
                                                                    file.name
                                                                )
                                                            }
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                }
                                            >
                                                <ListItemText primary={file.name} />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Button
                                        size="small"
                                        onClick={handleDownloadZip}
                                        sx={{ mb: 2 }}
                                    >
                                        Скачать ZIP задания
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Файлы отсутствуют или не загружены
                                    </Typography>

                                    <Button size="small" onClick={handleDownloadZip}>
                                        Скачать ZIP
                                    </Button>
                                </>
                            )}

                            {/* ===== COMMENTS ===== */}
                            <Typography variant="subtitle2" gutterBottom>
                                💬 Комментарии к задаче
                            </Typography>

                            {isLoadingComments && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Загрузка комментариев...
                                </Typography>
                            )}

                            {errorComments && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errorComments}
                                </Alert>
                            )}

                            {comments && comments.length > 0 ? (
                                <List dense>
                                    {comments.map((comment) => {
                                        const author = comment.author;
                                        const fullName =
                                            [author?.surname, author?.name, author?.patronymic]
                                                .filter(Boolean)
                                                .join(' ') ||
                                            `Пользователь ${comment.user_id}`;

                                        const isOwn =
                                            comment.user_id ===
                                            localStorage.getItem('user_id');

                                        return (
                                            <ListItem
                                                key={comment.id}
                                                sx={{
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    bgcolor: isOwn
                                                        ? 'action.hover'
                                                        : 'background.default',
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="bold"
                                                        >
                                                            {fullName}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2">
                                                                {comment.content}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {new Date(
                                                                    comment.timestamp
                                                                ).toLocaleString('ru-RU')}
                                                            </Typography>
                                                        </>
                                                    }
                                                />

                                                {isOwn && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteComment(comment.id)
                                                        }
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            ) : (
                                !isLoadingComments && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Комментариев пока нет
                                    </Typography>
                                )
                            )}

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <TextField
                                    size="small"
                                    placeholder="Напишите комментарий..."
                                    fullWidth
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddComment();
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={handleAddComment}
                                                >
                                                    <AddCommentIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default TaskItem;
