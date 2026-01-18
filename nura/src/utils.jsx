// /home/nechi/work/Nura/frontend/nura/src/utils.jsx

/**
 * Create a URL path for a page name.
 *
 * Usage:
 *   navigate(createPageUrl('Settings'));
 *   navigate(createPageUrl('User Profile', { params: 123 }));
 *   navigate(createPageUrl('/custom/path', { query: { q: 'foo' } }));
 *
 * @param {string} page - Page name or path. If it starts with '/', it's used as-is (except query/params).
 * @param {{params?: string|number|Array<string|number>, query?: Record<string, any>}} [opts]
 * @returns {string} path suitable for react-router navigate()
 */
export function createPageUrl(page, opts = {}) {
    if (!page) return '/';

    const { params, query } = opts;

    // base path: if page starts with '/', use as-is; otherwise slugify the name
    const base =
        typeof page === 'string' && page.startsWith('/')
            ? page.replace(/\/+$/g, '') // remove trailing slashes
            : slugify(page);

    // attach params
    let path = base;
    if (params !== undefined && params !== null) {
        if (Array.isArray(params)) {
            path += '/' + params.map(p => encodeURIComponent(String(p))).join('/');
        } else {
            path += '/' + encodeURIComponent(String(params));
        }
    }

    // attach query string
    if (query && typeof query === 'object' && Object.keys(query).length) {
        const qp = new URLSearchParams();
        Object.entries(query).forEach(([k, v]) => {
            if (v === undefined || v === null) return;
            if (Array.isArray(v)) {
                v.forEach(item => qp.append(k, String(item)));
            } else {
                qp.append(k, String(v));
            }
        });
        const qs = qp.toString();
        if (qs) path += '?' + qs;
    }

    return path;
}

function slugify(name) {
    if (!name) return '/';
    return (
        '/' +
        String(name)
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // remove non word/space/hyphen
            .replace(/[_\s]+/g, '-') // spaces/underscores -> hyphen
            .replace(/-+/g, '-') // collapse multiple hyphens
            .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    );
}

export default createPageUrl;