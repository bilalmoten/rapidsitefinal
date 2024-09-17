# Glassmorphism Effect with Tailwind CSS and Next.js

This markdown file demonstrates how to create a **Glassmorphism** effect for a card component using **Tailwind CSS** in a **Next.js** project. We will also add a subtle tilt animation effect using **VanillaTilt.js**.

### Glassmorphism Card Component:

```html
<div class="container-02">
  <h2>Glassmorphism</h2>
  <div class="glassmorphic-card">
    <div class="imgBox">
      <i class="fa fa-pencil-ruler"></i>
    </div>
    <div class="contentBox">
      <h3>Design</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard ...
      </p>
      <a href="#"><span>Read More</span></a>
    </div>
  </div>
  <p><span>CSS Property:</span> Backdrop-Filter</p>
</div>

Tailwind CSS for Glassmorphism: @tailwind base; @tailwind components; @tailwind
utilities; .container-02 { @apply flex flex-col items-center justify-center
h-screen w-1/2 bg-gray-900 relative; } .container-02 h2 { @apply text-center
text-white font-bold text-2xl p-2 rounded-lg border-t border-l border-white/50
bg-white/10 backdrop-blur-lg; } .container-02::before { content: ''; @apply
absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500 to-pink-500
clip-path-circle; } .container-02::after { content: ''; @apply absolute top-0
left-0 w-full h-full bg-gradient-to-br from-blue-500 to-pink-500
clip-path-circle transform scale-75; } .glassmorphic-card { @apply relative flex
flex-col items-center justify-center w-80 h-96 p-8 bg-white/10 rounded-2xl
backdrop-blur-lg border border-white/20 shadow-xl; } .glassmorphic-card::before
{ content: ''; @apply absolute top-0 left-0 w-1/2 h-full bg-white/5; } .imgBox {
@apply text-center; } .imgBox i { @apply text-8xl text-white/10; } .contentBox {
@apply relative mt-5 text-center; } .contentBox::before { content: 'DIGITAL';
@apply absolute top-0 -left-32 text-6xl font-bold text-white/20 transform
-rotate-90; } .contentBox h3 { @apply text-2xl text-white font-bold; }
.contentBox p { @apply text-white text-base font-light; } .contentBox a { @apply
inline-block mt-4 px-5 py-2 bg-white text-black rounded-lg shadow-md; } Adding
the Tilt Effect with VanillaTilt.js To add the tilt effect for the Glassmorphism
card, you can use VanillaTilt.js. Install it by running: npm install
vanilla-tilt Then, in your component, add this code: import { useEffect } from
'react'; import VanillaTilt from 'vanilla-tilt'; export default function
GlassmorphicCard() { useEffect(() => { const card =
document.querySelector('.glassmorphic-card'); VanillaTilt.init(card, { max: 15,
speed: 200, glare: true, 'max-glare': 1, }); }, []); return (
<div className="container-02">
  <h2>Glassmorphism</h2>
  <div className="glassmorphic-card">
    <div className="imgBox">
      <i className="fa fa-pencil-ruler"></i>
    </div>
    <div className="contentBox">
      <h3>Design</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <a href="#"><span>Read More</span></a>
    </div>
  </div>
  <p><span>CSS Property:</span> Backdrop-Filter</p>
</div>
); }
```
