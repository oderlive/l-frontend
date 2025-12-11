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
    Paper,
} from '@mui/material';
import { ExpandMore, ExpandLess, Delete as DeleteIcon, AddComment as AddCommentIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectTaskComments,
    selectCommentsLoading,
    selectCommentsError,
} from '../../features/comments/commentsSlice';
import { getTaskComments, addTaskComment, deleteTaskComment } from '../../features/comments/comments';

const TaskItem = ({ task, onEdit, onDelete, onAddSolution }) => {
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');

    // ✅ useSelector — теперь на верхнем уровне компонента
    const comments = useSelector((state) => selectTaskComments(state, task.id));
    const isLoadingComments = useSelector((state) => state.comments.loading);
    const errorComments = useSelector((state) => state.comments.error);

    const handleToggle = async () => {
        if (!expanded) {
            setExpanded(true);
            // Загружаем комментарии при раскрытии
            await dispatch(getTaskComments(task.id)).catch(console.error);
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
            await dispatch(deleteTaskComment({ taskId: task.id, commentId })).unwrap();
        } catch (err) {
            console.error('Ошибка при удалении комментария:', err);
        }
    };

    return (
        <>
            <TableRow hover>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description || '—'}</TableCell>
                <TableCell align="right">
                    <Button size="small" variant="outlined" color="primary" onClick={() => onEdit(task)} sx={{ mr: 1 }}>
                        Редактировать
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => onDelete(task.id)} sx={{ mr: 1 }}>
                        Удалить
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onAddSolution(task)}
                        sx={{ mr: 1 }}
                    >
                        Добавить решение
                    </Button>
                    <IconButton size="small" onClick={handleToggle} color="primary">
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={4} sx={{ py: 0, borderBottom: 'none' }}>
                    <Collapse in={expanded} timeout="auto">
                        <Box sx={{ m: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Комментарии к задаче
                            </Typography>

                            {isLoadingComments && (
                                <Typography variant="body2" color="textSecondary">
                                    Загрузка комментариев...
                                </Typography>
                            )}

                            {errorComments && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errorComments}
                                </Alert>
                            )}

                            {comments.length > 0 ? (
                                <List dense>
                                    {comments.map((comment) => {
                                        const author = comment.author;
                                        const fullName = [author.surname, author.name, author.patronymic]
                                            .filter(Boolean)
                                            .join(' ') || `Пользователь ${comment.user_id}`;

                                        return (
                                            <ListItem
                                                key={comment.id}
                                                sx={{
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    bgcolor: comment.user_id === localStorage.getItem('user_id')
                                                        ? 'action.hover'
                                                        : 'background.default',
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {fullName}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2">{comment.content}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(comment.timestamp).toLocaleString('ru-RU')}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                {comment.user_id === localStorage.getItem('user_id') && (
                                                    <IconButton
                                                        size="small"
                                                        edge="end"
                                                        color="error"
                                                        onClick={() => handleDeleteComment(comment.id)}
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
                                    <Typography variant="body2" color="text.secondary">
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
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleAddComment();
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size="small" color="primary" onClick={handleAddComment}>
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
