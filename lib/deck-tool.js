import { defineTool } from '@deepseek-ai/dsh-tools';
import { extname } from 'node:path';
import { projectImage } from './design-tools.js';
export function createDeckTool(services) {
    return defineTool({
        name: 'openpencil_deck',
        description: 'Create an editable slide presentation from the approved content in the current project. One frame per slide. Use this for presentations instead of the web-page pipeline. Supply existing project image files for slides requiring pictures. After success call openpencil_render with the returned path and editable=true to show Edit canvas.',
        parameters: {
            path: { type: 'string', required: true, description: 'New .op filename in this workspace.' },
            slides: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
                        title: { type: 'string', required: true }, body: { type: 'string', required: true },
                        imageFile: { type: 'string', description: 'Path to a project PNG, JPEG or WebP.' },
                    } } },
        },
        output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
        async execute({ path, slides }, exec) {
            if (extname(path).toLowerCase() !== '.op' || !slides.length || slides.length > 100)
                throw Error('Choose a new .op path and provide 1–100 slides');
            const policy = services.sandboxPolicy.resolve({ session: exec.agent?.session });
            if (policy.mode === 'read-only')
                throw Error('The presentation needs Workspace Write access');
            const cwd = exec.agent?.session.header.cwd ?? policy.workspaceRoot;
            const target = await services.fs.resolve(path, { cwd, signal: exec.signal });
            const children = [];
            let sequence = 0;
            let imageBytes = 0;
            const id = () => 'n' + (++sequence);
            const fill = (color) => [{ type: 'solid', color }];
            for (const [i, slide] of slides.entries()) {
                if (!slide.title.trim() || !slide.body.trim())
                    throw Error('Each slide needs a title and body');
                const text = (name, content, y, width, height, fontSize) => ({ id: id(), type: 'text', name, content, x: 48, y, width, height, fontSize, lineHeight: 1.24,
                    fontFamily: 'Inter, system-ui, sans-serif', fill: fill('#202D37') });
                const nodes = [text('Title', slide.title, 38, 864, 116, 40), text('Body', slide.body, 165, slide.imageFile ? 420 : 864, 330, 24)];
                if (slide.imageFile) {
                    const src = await projectImage(cwd, slide.imageFile);
                    imageBytes += Buffer.byteLength(src);
                    if (imageBytes > 60 * 1024 * 1024)
                        throw Error('Reduce image sizes to fit a 64 MiB document');
                    nodes.push({ id: id(), type: 'image', name: slide.imageFile, src, x: 495, y: 165, width: 417, height: 300 });
                }
                children.push({ id: id(), type: 'frame', name: slide.title, x: i * 1008, y: 0, width: 960, height: 540, layout: 'none', fill: fill('#FAF8F2'), children: nodes });
            }
            const doc = JSON.stringify({ version: '1.0.0', children });
            if (Buffer.byteLength(doc) > 64 * 1024 * 1024)
                throw Error('Presentation exceeds the editor size limit');
            const saved = await services.fs.writeText(target, doc, { kind: 'createIfAbsent' }, exec.signal, policy);
            services.observe(target, { kind: 'present', version: saved.version }, exec);
            return JSON.stringify({ path, slides: slides.length, next: 'Call openpencil_render now with this path and editable=true.' });
        },
    });
}
