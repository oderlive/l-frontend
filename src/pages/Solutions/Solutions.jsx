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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";

// Используем экшены и селекторы из Redux
import {
    selectReviewedSolutions,
    selectUnreviewedSolutions,
    selectSolutions,
    selectIsLoading,
    selectError,
} from "../../features/solution/solutionsSlice";
import * as solutionsActions from "../../features/solution/solutions";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
}));

const ReviewButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#4caf50",
    color: "#fff",
    "&:hover": { backgroundColor: "#388e3c" },
    marginRight: theme.spacing(1),
}));

const RevokeButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#f44336",
    color: "#fff",
    "&:hover": { backgroundColor: "#d32f2f" },
}));

const Solutions = ({ courseId }) => {
    const dispatch = useDispatch();

    const solutions = useSelector(selectSolutions);
    const reviewedSolutions = useSelector(selectReviewedSolutions);
    const unreviewedSolutions = useSelector(selectUnreviewedSolutions);
    const loading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    const [selectedSolution, setSelectedSolution] = useState(null);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewScore, setReviewScore] = useState(10);
    const [activeTab, setActiveTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [expandedFile, setExpandedFile] = useState(null);
    const [fileContent, setFileContent] = useState({}); // кэш содержимого файлов

    // Загрузка решений при изменении вкладки
    useEffect(() => {
        if (!courseId) return;

        let action;
        switch (activeTab) {
            case 1:
                action = solutionsActions.getReviewedBatchSolutionsForCourse(courseId);
                break;
            case 2:
                action = solutionsActions.getUnreviewedBatchSolutionsForCourse(courseId);
                break;
            default:
                action = solutionsActions.getBatchSolutionsForCourse(courseId);
        }

        dispatch(action);
    }, [dispatch, courseId, activeTab]);

    const handleReview = (solution) => {
        setSelectedSolution(solution);
        setReviewComment(solution.feedback || "");
        setReviewScore(solution.score || 10);
        setExpandedFile(null);
        setFileContent({});
        setOpenDialog(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedSolution) return;

        try {
            await dispatch(
                solutionsActions.reviewSolution({
                    solutionId: selectedSolution.id,
                    feedback: reviewComment,
                    score: reviewScore,
                })
            ).unwrap();

            setOpenDialog(false);
            setReviewComment("");
            setReviewScore(10);
        } catch (err) {
            console.error("❌ Ошибка при проверке решения:", err);
        }
    };

    const handleRevoke = async (solutionId) => {
        if (!window.confirm("Вы уверены, что хотите отозвать проверку этого решения?")) return;

        try {
            await dispatch(solutionsActions.revokeSolution(solutionId)).unwrap();
        } catch (err) {
            console.error("❌ Ошибка при отзыве проверки:", err);
        }
    };

    const formatDate = (isoString) => {
        try {
            return new Date(isoString).toLocaleString("ru-RU");
        } catch {
            return "Неверная дата";
        }
    };

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

    // Загрузка содержимого файла
    const loadFileContent = async (file) => {
        if (fileContent[file.id]) return; // уже загружено

        if (!file.url) {
            setFileContent((prev) => ({ ...prev, [file.id]: "Файл недоступен." }));
            return;
        }

        try {
            const res = await fetch(file.url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            if (!res.ok) throw new Error("Ошибка загрузки файла");
            const text = await res.text();
            setFileContent((prev) => ({ ...prev, [file.id]: text }));
        } catch (err) {
            setFileContent((prev) => ({ ...prev, [file.id]: "Не удалось загрузить содержимое файла." }));
        }
    };

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
                        Ошибка: {typeof error === "string" ? error : JSON.stringify(error)}
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
                                                    {solution.reviewed && (
                                                        <>
                                                            <br />
                                                            <Typography component="span" variant="body2" color="textSecondary">
                                                                Оценка: {solution.score}/10
                                                            </Typography>
                                                        </>
                                                    )}
                                                    <br />
                                                    <Chip
                                                        size="small"
                                                        label={solution.reviewed ? "Проверено" : "Не проверено"}
                                                        color={solution.reviewed ? "success" : "default"}
                                                        sx={{ mt: 1 }}
                                                    />
                                                    {solution.content && solution.content.length > 0 && (
                                                        <Box mt={1}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Файлы: {solution.content.map((f) => f.original_file_name).join(", ")}
                                                            </Typography>
                                                        </Box>
                                                    )}
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

            {/* Диалог проверки */}
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
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Приложенные файлы:
                                </Typography>
                                {selectedSolution.content && selectedSolution.content.length > 0 ? (
                                    selectedSolution.content.map((file) => (
                                        <Accordion
                                            key={file.id}
                                            expanded={expandedFile === file.id}
                                            onChange={() => {
                                                if (expandedFile !== file.id) {
                                                    setExpandedFile(file.id);
                                                    loadFileContent(file);
                                                } else {
                                                    setExpandedFile(null);
                                                }
                                            }}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="body2">{file.original_file_name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
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
                                                    {fileContent[file.id] ? (
                                                        <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
                                                            {fileContent[file.id]}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="caption" color="textSecondary">
                                                            Загрузка...
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        Нет приложенных файлов.
                                    </Typography>
                                )}
                            </Box>

                            <TextField
                                label="Оценка (от 0 до 10)"
                                type="number"
                                inputProps={{ min: 0, max: 10 }}
                                fullWidth
                                value={reviewScore}
                                onChange={(e) => setReviewScore(Number(e.target.value))}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                label="Комментарий к проверке"
                                multiline
                                rows={4}
                                fullWidth
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                variant="outlined"
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
