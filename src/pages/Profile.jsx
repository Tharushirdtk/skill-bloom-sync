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
import useFetch from "../hooks/UseFetch";
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
                    {availableSkills.map((skill) => (
                      <MenuItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched.skillId && errors.skillId}
                  </FormHelperText>
                </FormControl>
              )}
              <Field
                component={FormikTextField}
                name="proficiencyScore"
                label="Proficiency Score"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 100 }}
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={20} />
                ) : isEdit ? (
                  "Save"
                ) : (
                  "Assign"
                )}
              </Button>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
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
  // Use useFetch for skillsAPI.getAll(companyId)
  const {
    data: availableSkills,
    loading: availableSkillsLoading,
    error: availableSkillsError,
    refetch: refetchAvailableSkills,
  } = useFetch(
    () => skillsAPI.getAll(user?.companyId ?? null),
    [user?.companyId]
  );
  const [assignedSkills, setAssignedSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showCertDialog, setShowCertDialog] = useState(false);
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

  // Add certificate handler
  const handleAddCertificate = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      if (!user?.id) throw new Error("User not loaded");
      await employeeAPI.addCertificate(user.id, values);
      // Reload certificates
      if (employeeAPI.getCertificates) {
        const certRaw = await employeeAPI.getCertificates(user.id);
        const certs = unwrapResponse(certRaw) || [];
        setCertificates(Array.isArray(certs) ? certs : []);
      }
      setShowCertDialog(false);
    } catch (err) {
      alert(
        "Failed to add certificate: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete certificate handler with confirmation
  const handleDeleteCertificate = async (idx) => {
    const cert = certificates[idx];
    if (!cert) return;
    if (
      !window.confirm(
        `Are you sure you want to delete certificate '${
          cert.name || cert.skill?.name || ""
        }'? This action cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await employeeAPI.deleteCertificate(user.id, cert.id);
      setCertificates((prev) => prev.filter((_, i) => i !== idx));
      alert("Certificate deleted successfully.");
    } catch (err) {
      alert(
        "Failed to delete certificate: " +
          (err.response?.data?.message || err.message)
      );
    }
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
        const assignedRaw = await employeeAPI.getSkills(me.id);
        const assigned = unwrapResponse(assignedRaw) || [];
        setAssignedSkills(Array.isArray(assigned) ? assigned : []);

        // Fetch certificates for this employee
        const certRaw = (await employeeAPI.getCertificates)
          ? await employeeAPI.getCertificates(me.id)
          : [];
        const certs = unwrapResponse(certRaw) || [];
        setCertificates(Array.isArray(certs) ? certs : []);
      } catch (err) {
        console.error("Error fetching profile/skills/certificates:", err);
        alert("Failed to load profile, skills, or certificates.");
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
      await refetchAvailableSkills();
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
      <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", py: 0 }}>
        {/* Main Content Card */}
        <Grid item xs={12} md={8} sx={{ display: "flex" }}>
          <Card
            sx={{
              borderRadius: 5,
              boxShadow: 4,
              px: 3,
              py: 5,
              background: "white",
              width: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Profile Details
              </Typography>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  size="medium"
                  sx={{
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px 0 rgba(124,58,237,0.12)",
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

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
                                  form.setFieldValue("position", e.target.value)
                                }
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Developer">Developer</MenuItem>
                                <MenuItem value="Manager">Manager</MenuItem>
                                <MenuItem value="Designer">Designer</MenuItem>
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
                          sx={{
                            flex: 1,
                            py: 1.2,
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
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
                          sx={{
                            flex: 1,
                            py: 1.2,
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
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
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight={500}
                      minWidth={120}
                    >
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight={500}
                      minWidth={120}
                    >
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.email}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight={500}
                      minWidth={120}
                    >
                      Position
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.position}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      fontWeight={500}
                      minWidth={120}
                    >
                      Joined Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.joinDate}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Skills Section */}
            <Box mt={5}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={700}>
                  Skills
                </Typography>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px 0 rgba(124,58,237,0.12)",
                  }}
                  onClick={handleAddSkillClick}
                >
                  Add Skill
                </Button>
              </Box>

              {loadingSkills || availableSkillsLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress />
                </Box>
              ) : assignedSkills.length === 0 ? (
                <Typography color="text.secondary">
                  No skills assigned yet.
                </Typography>
              ) : (
                <Grid container spacing={3} mt={1}>
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

              <Box mt={4}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="primary"
                >
                  Quick Assign Skills
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
                  {availableSkills.map((s) => (
                    <Button
                      key={s.id}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        fontWeight: "bold",
                        px: 2,
                        py: 0.5,
                      }}
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

        {/* Certificates Section */}
        <Card
          sx={{
            borderRadius: 5,
            boxShadow: 4,
            px: 3,
            py: 5,
            background: "white",
            width: "100%",
            mt: 5,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={700}>
              Certificates
            </Typography>
            <Button
              variant="contained"
              size="medium"
              sx={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                fontWeight: "bold",
                boxShadow: "0 2px 8px 0 rgba(124,58,237,0.12)",
              }}
              onClick={() => setShowCertDialog(true)}
            >
              Add Certificate
            </Button>
          </Box>
          {/* Certificates List */}
          {certificates && certificates.length > 0 ? (
            <Grid container spacing={3} mt={1}>
              {certificates.map((cert, idx) => (
                <Grid item key={idx} xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {cert.name}
                    </Typography>
                    <Typography variant="body2">
                      Issued By: {cert.issuedBy}
                    </Typography>
                    <Typography variant="body2">
                      Issue Date: {cert.issueDate}
                    </Typography>
                    {/* <Typography variant="body2">Expiry Date: {cert.expiryDate}</Typography> */}
                    <Box mt={2} display="flex" gap={1}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCertificate(idx)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              No certificates added yet.
            </Typography>
          )}
        </Card>

        {/* Certificate Dialog */}
        <Dialog
          open={showCertDialog}
          onClose={() => setShowCertDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Add Certificate</DialogTitle>
          <Formik
            initialValues={{ name: "", issuedBy: "", issueDate: "" }}
            onSubmit={handleAddCertificate}
          >
            {({ values, handleChange, isSubmitting }) => (
              <Form>
                <DialogContent
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField
                    label="Certificate Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Issued By"
                    name="issuedBy"
                    value={values.issuedBy}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.issueDate}
                    onChange={handleChange}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => setShowCertDialog(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </Box>
    </EmployeeLayout>
  );
};

export default Profile;
