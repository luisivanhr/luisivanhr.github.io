
# Interactive Desk Site (Jekyll)

## Quick start
1. Push this repo to GitHub and enable **GitHub Pages** (root).
2. In **Settings → Pages → Custom domain**, set your domain (e.g., `luisivanhr.com`) and add a DNS CNAME to `<username>.github.io`.
3. Replace `assets/images/desk/background.jpg` with your **desk background** (16:9 recommended).
4. Edit hotspot positions in `_includes/desk-hotspots.svg` (use Inkscape; the `points` attribute defines polygon vertices).
5. Tweak patch positions in `assets/css/main.css`:
   - `.patch.monitor2 { transform: translate(Xpx, Ypx) rotate(θdeg) }`
   - `.patch.board { transform: translate(Xpx, Ypx) rotate(θdeg) }`
6. Add real content in `/_posts`, `/_models`, `/_courses`, `/_hobbies`, `/_achievements`, and `/_news`.

## Hotspots with Inkscape
- Open `_includes/desk-hotspots.svg` in **Inkscape**.
- Use the **Edit paths by nodes** tool to drag vertices to match objects.
- Save; Jekyll will inline this SVG on the homepage.

## Feeds powering the desk previews
- JSON feeds are generated at `/data/*.json` via template files (`blog.json`, `models.json`, etc.).
- The homepage fetches these to show the latest item on hover and in the banner.

## Blackboard equations
- Add to `data/equations.json`. Currently: `"a=b", "b=c", "c=d"`.
- If you want KaTeX rendering, include its real JS/CSS (replace placeholders in `assets/js/*` and `assets/css/katex.min.css`).

## Particles (hook points)
- `assets/js/main.js` is ready for adding particle emitters per hotspot.
- For performance, respect `prefers-reduced-motion`.

## Classic fallback
- `/classic/` lists all sections in a standard layout for accessibility and mobile.
