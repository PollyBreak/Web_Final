const Project = require('./models/project')
const { validationResult } = require('express-validator')
class projectController {

    async createProject(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors: errors.array() });
            }

            const { name_en, name_ru, stack, description_en, description_ru, images } = req.body;

            const project = new Project({
                name_en,
                name_ru,
                stack,
                description_en,
                description_ru,
                images,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
                deleted: false,
            });

            await project.save();

            return res.status(201).json({ message: 'Project created successfully', project });
        } catch (error) {
            // console.error(error);
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
    }

    async getProjects(req, res) {
        try {
            const projects = await Project.find({ deleted: false });
            return res.json(projects);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getProjectById(req, res) {
        try {
            const project = await Project.findOne({ _id: req.params.id, deleted: false });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            return res.json(project);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async updateProjectById(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors: errors.array() });
            }

            const { name_en, name_ru, stack, description_en, description_ru, images } = req.body;

            const updatedProject = await Project.findByIdAndUpdate(
                req.params.id,
                {
                    name_en,
                    name_ru,
                    stack,
                    description_en,
                    description_ru,
                    images,
                    updatedAt: new Date(),
                },
                { new: true, runValidators: true }
            );

            if (!updatedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }

            return res.json({ message: 'Project updated successfully', project: updatedProject });
        } catch (error) {
            // console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async deleteProjectById(req, res) {
        try {
            const deletedProject = await Project.findByIdAndUpdate(
                req.params.id,
                {
                    deletedAt: new Date(),
                    deleted: true,
                },
                { new: true }
            );

            if (!deletedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }

            return res.json({ message: 'Project deleted successfully', project: deletedProject });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new projectController()