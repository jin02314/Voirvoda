import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'Web Development',
      description: 'A modern e-commerce solution with seamless checkout and inventory management',
      image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY5ODE5MDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['React', 'TypeScript', 'Node.js'],
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'UI/UX Design',
      description: 'Intuitive mobile banking experience with focus on security and usability',
      image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzY5ODI3NzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Figma', 'React Native', 'Animation'],
    },
    {
      id: 3,
      title: 'Creative Studio Website',
      category: 'Branding & Web',
      description: 'Portfolio website for a creative studio showcasing their work and process',
      image: 'https://images.unsplash.com/photo-1512295511015-007ed4340409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzaWduJTIwc3R1ZGlvfGVufDF8fHx8MTc2OTg1Mjc2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Next.js', 'Tailwind', 'CMS'],
    },
    {
      id: 4,
      title: 'Project Management Tool',
      category: 'SaaS Product',
      description: 'Collaborative platform for teams to manage projects and track progress',
      image: 'https://images.unsplash.com/photo-1759884837460-a296cb57a3d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHByb2plY3QlMjBtb2NrdXB8ZW58MXx8fHwxNzY5NzY3NTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tags: ['Vue.js', 'GraphQL', 'PostgreSQL'],
    },
  ];

  return (
    <section id="projects" className="min-h-screen py-32 px-6 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Selected Work</h2>
          <p className="text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-tight">
            Projects that showcase creativity and technical excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ArrowUpRight className="w-12 h-12" />
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-wider text-gray-400">
                  {project.category}
                </p>
                <h3 className="text-2xl group-hover:text-gray-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs uppercase tracking-wider border border-white/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
