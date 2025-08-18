// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stack,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import EmployeeLayout from "../components/EmployeeLayout";
import { useUser } from "../context/UserContext";
import { userAPI, skillsAPI, employeeAPI } from "../apis/userApi";
import { Formik, Form, Field } from "formik";
import { TextField as FormikTextField } from "formik-mui";
import * as Yup from "yup";

/**
 * Assigned skill card component
 */
const AssignedSkillCard = ({ assigned, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        "&:hover": { boxShadow: 3 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={500}>
          {assigned.skill?.name || `Skill #${assigned.skill?.id}`}
        </Typography>
        <Typography variant="body2" mt={0.5}>
          <strong>Level:</strong> {assigned.proficiency}
        </Typography>
        <Typography variant="body2">
          <strong>Score:</strong> {assigned.proficiencyScore}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          {assigned.lastUpdated
            ? `Updated: ${new Date(assigned.lastUpdated).toLocaleDateString()}`
            : ""}
        </Typography>
      </Box>

      <Box mt={2} display="flex" gap={1}>
        <Button size="small" onClick={() => onEdit(assigned)}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(assigned)}>
          Delete
        </Button>
      </Box>
    </Card>
  );
};

/**
 * EmployeeSkillDialog
 */
const EmployeeSkillDialog = ({
  open,
  onClose,
  availableSkills = [],
  initial = null,
  prefillSkillId = null,
  onSave,
}) => {
  const isEdit = Boolean(initial && initial.id);

  const validationSchema = Yup.object({
    skillId: isEdit
      ? Yup.mixed().notRequired()
      : Yup.number()
          .typeError("Skill is required")
          .required("Skill is required"),
    proficiencyScore: Yup.number()
      .typeError("Score must be a number")
      .min(0, "Score must be at least 0")
      .max(100, "Score must be at most 100")
      .required("Score is required"),
  });

  const initialValues = {
    skillId: initial ? initial.skill?.id : prefillSkillId ?? "",
    proficiencyScore: initial ? initial.proficiencyScore : 50,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { p: 3, borderRadius: 2 } }}
    >
      <DialogTitle>
        {isEdit ? "Edit Skill Score" : "Assign Skill to Employee"}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("Dialog submit values:", values, "isEdit:", isEdit);
          setSubmitting(true);
          try {
            await onSave(values);
            onClose();
          } catch (err) {
            console.error("Dialog save error:", err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, isSubmitting, errors, touched }) => (
          <Form>
            <DialogContent
              dividers
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {!isEdit && (
                <FormControl
                  fullWidth
                  error={Boolean(touched.skillId && errors.skillId)}
                >
                  <InputLabel id="skill-select-label">Skill</InputLabel>
                  <Select
                    labelId="skill-select-label"
                    name="skillId"
                    value={values.skillId}
                    label="Skill"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {availableSkills.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.skillId && errors.skillId && (
                    <FormHelperText>{errors.skillId}</FormHelperText>
                  )}
                </FormControl>
              )}

              <Field
                component={FormikTextField}
                name="proficiencyScore"
                type="number"
                label="Proficiency Score (0–100)"
                inputProps={{ min: 0, max: 100 }}
                fullWidth
              />

              <Typography variant="caption" color="text.secondary">
                Provide a numeric score (0–100). The backend will compute the
                human-friendly level.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={20} />
                ) : isEdit ? (
                  "Save"
                ) : (
                  "Assign"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const Profile = () => {
  const { user, setUser, logout } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [assignedSkills, setAssignedSkills] = useState([]);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [skillDialogInitial, setSkillDialogInitial] = useState(null);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [prefillSkillId, setPrefillSkillId] = useState(null);

  const unwrapResponse = (maybeResp) => {
    if (!maybeResp) return maybeResp;
    if (Array.isArray(maybeResp)) return maybeResp;
    if (maybeResp.data !== undefined) return maybeResp.data;
    return maybeResp;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const me = await userAPI.getMe();
        setUser(me);
        setInitialValues({
          fname: me.name ? me.name.split(" ")[0] : "",
          lname: me.name ? me.name.split(" ").slice(1).join(" ") : "",
          email: me.email || "",
          position: me.position || "",
        });

        setLoadingSkills(true);
        const [skillListRaw, assignedRaw] = await Promise.all([
          skillsAPI.getAll(),
          employeeAPI.getSkills(me.id),
        ]);

        const skillList = unwrapResponse(skillListRaw);
        const assigned = unwrapResponse(assignedRaw) || [];

        setAvailableSkills(skillList || []);
        setAssignedSkills(Array.isArray(assigned) ? assigned : []);
      } catch (err) {
        console.error("Error fetching profile/skills:", err);
        alert("Failed to load profile or skills.");
      } finally {
        setLoading(false);
        setLoadingSkills(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    position: Yup.string(),
  });

  const reloadAssignedSkills = async () => {
    if (!user?.id) return;
    try {
      setLoadingSkills(true);
      const assignedRaw = await employeeAPI.getSkills(user.id);
      const assigned = unwrapResponse(assignedRaw) || [];
      setAssignedSkills(Array.isArray(assigned) ? assigned : []);
    } catch (err) {
      console.error("Failed to reload assigned skills:", err);
      alert("Failed to reload assigned skills");
    } finally {
      setLoadingSkills(false);
    }
  };

  const reloadAvailableSkills = async () => {
    try {
      const list = await skillsAPI.getAll();
      setAvailableSkills(list || []);
    } catch (err) {
      console.error("Failed to reload available skills:", err);
    }
  };

  const handleAddSkillClick = () => {
    setPrefillSkillId(null);
    setSkillDialogInitial(null);
    setSkillDialogOpen(true);
  };

  const handleQuickAssign = (skillId) => {
    setPrefillSkillId(skillId);
    setSkillDialogInitial(null);
    setSkillDialogOpen(true);
  };

  const handleEditAssignedSkill = (assigned) => {
    setSkillDialogInitial(assigned);
    setPrefillSkillId(null);
    setSkillDialogOpen(true);
  };

  const handleDeleteAssignedSkill = async (assigned) => {
    if (
      !window.confirm(
        `Delete ${assigned.skill?.name || "this skill"} from your profile?`
      )
    )
      return;

    try {
      await employeeAPI.deleteSkill(user.id, assigned.skill.id);
      await reloadAssignedSkills();
    } catch (err) {
      console.error("Failed to delete assigned skill:", err);
      alert(
        `Failed to delete skill: ${
          err.response?.data?.message || err.message || "Unknown"
        }`
      );
    }
  };

  const handleSaveAssignedSkill = async (values) => {
    try {
      if (!user?.id) throw new Error("User not loaded");

      if (skillDialogInitial && skillDialogInitial.id) {
        await employeeAPI.updateSkill(user.id, skillDialogInitial.skill.id, {
          proficiencyScore: parseInt(values.proficiencyScore, 10),
        });
      } else {
        if (!values.skillId) throw new Error("Skill is required");
        await employeeAPI.addSkill(user.id, {
          skillId: parseInt(values.skillId, 10),
          proficiencyScore: parseInt(values.proficiencyScore, 10),
        });
      }

      await reloadAssignedSkills();
      await reloadAvailableSkills();

      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to save skill: ${msg}`);
      return false;
    }
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const fullName = [values.fname, values.lname].filter(Boolean).join(" ");
      const payload = {
        name: fullName,
        email: values.email,
        position: values.position,
      };

      await employeeAPI.update(user.id, payload);

      const updatedUser = await userAPI.getMe();
      setUser(updatedUser);
      setIsEditing(false);
      setInitialValues({
        fname: updatedUser.name ? updatedUser.name.split(" ")[0] : "",
        lname: updatedUser.name
          ? updatedUser.name.split(" ").slice(1).join(" ")
          : "",
        email: updatedUser.email || "",
        position: updatedUser.position || "",
      });
    } catch (err) {
      console.error("Update failed:", err);
      alert(
        `Failed to update profile: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !initialValues) {
    return (
      <EmployeeLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
          width="100%"
        >
          <CircularProgress />
        </Box>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      {/* outer wrapper centers content vertically and horizontally */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh", // centers within the viewport area
          width: "100%",
          px: 2,
        }}
      >
        {/* inner container controls max width of the content */}
        <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", py: 4 }}>
          <Grid container spacing={3}>
            {/* Left Panel */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                  }}
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.position || "No Position"}
                </Typography>
                <Divider sx={{ my: 2 }} />
                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    fullWidth
                    sx={{ textTransform: "none" }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Card>
            </Grid>

            {/* Right Panel */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 9, borderRadius: 5, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Profile Details
                </Typography>

                {isEditing ? (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleProfileSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              component={FormikTextField}
                              name="fname"
                              label="First Name"
                              fullWidth
                              autoFocus
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              component={FormikTextField}
                              name="lname"
                              label="Last Name"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              component={FormikTextField}
                              name="email"
                              label="Email"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field name="position">
                              {({ field, form }) => (
                                <FormControl fullWidth>
                                  <InputLabel id="position-select-label">
                                    Position
                                  </InputLabel>
                                  <Select
                                    labelId="position-select-label"
                                    {...field}
                                    onChange={(e) =>
                                      form.setFieldValue(
                                        "position",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Developer">
                                      Developer
                                    </MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                    <MenuItem value="Designer">
                                      Designer
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            </Field>
                          </Grid>

                          <Grid item xs={12} display="flex" gap={2} mt={1}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={isSubmitting}
                              sx={{ flex: 1 }}
                            >
                              {isSubmitting ? (
                                <CircularProgress size={20} />
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Cancel />}
                              onClick={() => setIsEditing(false)}
                              disabled={isSubmitting}
                              sx={{ flex: 1 }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <Box mt={2}>
                    <Typography>
                      <strong>Name:</strong> {user.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography>
                      <strong>Position:</strong> {user.position}
                    </Typography>
                    <Typography>
                      <strong>Joined Date:</strong> {user.joinDate}
                    </Typography>
                  </Box>
                )}

                {/* Skills Section */}
                <Box mt={4}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Skills
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddSkillClick}
                    >
                      Add Skill
                    </Button>
                  </Box>

                  {loadingSkills ? (
                    <Box display="flex" justifyContent="center" py={2}>
                      <CircularProgress />
                    </Box>
                  ) : assignedSkills.length === 0 ? (
                    <Typography color="text.secondary">
                      No skills assigned yet.
                    </Typography>
                  ) : (
                    <Grid container spacing={2} mt={1}>
                      {assignedSkills.map((assigned) => (
                        <Grid item key={assigned.id} xs={12} sm={6} md={4}>
                          <AssignedSkillCard
                            assigned={assigned}
                            onEdit={handleEditAssignedSkill}
                            onDelete={handleDeleteAssignedSkill}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  <Box mt={3}>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Available skills (quick assign)
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                      {availableSkills.map((s) => (
                        <Button
                          key={s.id}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickAssign(s.id)}
                        >
                          {s.name}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <EmployeeSkillDialog
            open={skillDialogOpen}
            onClose={() => {
              setSkillDialogOpen(false);
              setSkillDialogInitial(null);
              setPrefillSkillId(null);
            }}
            availableSkills={availableSkills}
            initial={skillDialogInitial}
            prefillSkillId={prefillSkillId}
            onSave={handleSaveAssignedSkill}
          />
        </Box>
      </Box>
    </EmployeeLayout>
  );
};

export default Profile;
