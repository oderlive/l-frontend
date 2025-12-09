import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";

// Импортируем селекторы и экшены
import {
    selectError,
    selectIsLoading,
    selectReviewedSolutions,
    selectSolutions,
    selectUnreviewedSolutions,
} from "../../features/solution/solutionsSlice";
import * as solutionsActions from "../../features/solution/solutions";
import {ENDPOINTS} from "../../features/api/endpoints";


// Стилизованный контейнер
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

// Стилизованная кнопка проверки
const ReviewButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#4caf50",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#388e3c",
    },
    marginRight: theme.spacing(1),
}));

// Стилизованная кнопка отзыва
const RevokeButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#f44336",
    color: "#fff",
    "&:hover": {
        backgroundColor: "#d32f2f",
    },
}));

const Solutions = () => {
    const dispatch = useDispatch();

    // Состояние из Redux
    const solutions = useSelector(selectSolutions);
    const reviewedSolutions = useSelector(selectReviewedSolutions);
    const unreviewedSolutions = useSelector(selectUnreviewedSolutions);
    const loading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    // Локальное состояние
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [reviewComment, setReviewComment] = useState("");
    const [activeTab, setActiveTab] = useState(0); // 0: все, 1: проверенные, 2: непроверенные

    // Получаем courseId извне (в реальности — из useParams или props)
    const courseId = "course_123"; // ← Заменить на пропс или из store



    const handleReview = (solution) => {
        if (!solution) return;
        setSelectedSolution(solution);
        setReviewComment(solution.feedback || "");
        setOpenDialog(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedSolution) return;

        try {
            await dispatch(solutionsActions.reviewSolution(selectedSolution.id)).unwrap();
            // Обновляем данные после успешной проверки
            dispatch(solutionsActions.getSolutionById(selectedSolution.id));
            dispatch(solutionsActions.getBatchSolutionsForCourse(courseId));
            setOpenDialog(false);
            setReviewComment("");
        } catch (err) {
            console.error("Ошибка при проверке решения:", err);
            // Ошибка уже в store
        }
    };

    const handleRevoke = async (solutionId) => {
        if (!window.confirm("Вы уверены, что хотите отозвать проверку этого решения?")) return;

        try {
            await dispatch(solutionsActions.revokeSolution(solutionId)).unwrap();
            dispatch(solutionsActions.getSolutionById(solutionId));
            dispatch(solutionsActions.getBatchSolutionsForCourse(courseId));
        } catch (err) {
            console.error("Ошибка при отзыве проверки:", err);
        }
    };

    const formatDate = (isoString) => {
        try {
            return new Date(isoString).toLocaleString("ru-RU");
        } catch {
            return "Неверная дата";
        }
    };

    // Фильтрация решений
    const displayedSolutions = React.useMemo(() => {
        switch (activeTab) {
            case 1:
                return reviewedSolutions || [];
            case 2:
                return unreviewedSolutions || [];
            default:
                return solutions || [];
        }
    }, [solutions, reviewedSolutions, unreviewedSolutions, activeTab]);

    // Проверка ENDPOINTS на этапе рендера
    if (!ENDPOINTS?.SOLUTIONS) {
        return (
            <Box sx={{ padding: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Конфигурация API не загружена. Проверьте файл <code>config/endpoints.js</code>.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Управление решениями студентов
            </Typography>

            <StyledPaper>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
                    <Tab label="Все решения" />
                    <Tab label="Проверенные" />
                    <Tab label="Непроверенные" />
                </Tabs>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Ошибка: {error}
                    </Alert>
                ) : (
                    <List>
                        {displayedSolutions.length === 0 ? (
                            <Typography color="textSecondary" align="center" my={3}>
                                Нет решений для отображения.
                            </Typography>
                        ) : (
                            displayedSolutions.map((solution) => (
                                <React.Fragment key={solution.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {solution.taskTitle || "Задание"}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box component="div" mt={0.5}>
                                                    <Typography component="span" variant="body2" color="textPrimary">
                                                        Студент: {solution.studentName || "Аноним"}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        Отправлено: {formatDate(solution.submittedAt)}
                                                    </Typography>
                                                    <br />
                                                    <Chip
                                                        size="small"
                                                        label={solution.reviewed ? "Проверено" : "Не проверено"}
                                                        color={solution.reviewed ? "success" : "default"}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            {!solution.reviewed ? (
                                                <ReviewButton
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleReview(solution)}
                                                >
                                                    Проверить
                                                </ReviewButton>
                                            ) : (
                                                <RevokeButton
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => handleRevoke(solution.id)}
                                                >
                                                    Отозвать
                                                </RevokeButton>
                                            )}
                                            <IconButton edge="end" aria-label="view">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                )}
            </StyledPaper>

            {/* Диалог проверки решения */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Проверка решения</DialogTitle>
                <DialogContent>
                    {selectedSolution && (
                        <>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Задание: {selectedSolution.taskTitle || "Без названия"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Студент: {selectedSolution.studentName || "Неизвестно"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Отправлено: {formatDate(selectedSolution.submittedAt)}
                            </Typography>

                            <Box mt={2} mb={2}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Код решения:
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        fontFamily: "monospace",
                                        backgroundColor: "#f5f5f5",
                                        maxHeight: 300,
                                        overflow: "auto",
                                    }}
                                >
                                    {selectedSolution.code ? (
                                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      {selectedSolution.code}
                    </pre>
                                    ) : (
                                        "Код не загружен"
                                    )}
                                </Paper>
                            </Box>

                            <TextField
                                label="Комментарий к проверке"
                                multiline
                                rows={4}
                                fullWidth
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                variant="outlined"
                                sx={{ mt: 1 }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="error">
                        Отмена
                    </Button>
                    <ReviewButton onClick={handleSubmitReview} startIcon={<CheckCircleIcon />}>
                        Подтвердить проверку
                    </ReviewButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Solutions;
