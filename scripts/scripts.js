const year = document.getElementById("year");
const goTop = document.getElementById("goTop");
let theme = document.getElementById("theme");

const date = new Date();
year.innerText = date.getFullYear();

window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    goTop.classList.add("show-scroll-top");
  } else {
    goTop.classList.remove("show-scroll-top");
  }
});

theme.onchange = () => {
  if (localStorage.getItem("theme") === "light") {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

window.onload = () => {
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    localStorage.setItem("theme", "light");
  } else {
    if (currentTheme === "light") {
      theme.attributes[0].ownerElement.checked = false;
    } else {
      theme.attributes[0].ownerElement.checked = true;
    }
  }
};

// const sections = document.querySelectorAll("main section");
// const navLis = document.querySelectorAll("nav ul li");
// window.addEventListener("scroll", () => {
//   let currentSectionId = "";

//   sections.forEach((section) => {
//     const sectionTop = section.offsetTop;
//     const sectionHeight = section.offsetHeight;

//     if (pageYOffset >= sectionTop - sectionHeight / 3) {
//       currentSectionId = section.getAttribute("id");
//     }
//   });

//   navLis.forEach((li) => {
//     li.classList.remove("active");

//     const a = li.querySelector("a");
//     if (a.getAttribute("href") === `#${currentSectionId}`) {
//       li.classList.add("active");
//     }
//   });
// });

const sections = document.querySelectorAll("main section");
const navLis = document.querySelectorAll("nav ul li");

// Create the observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;

        navLis.forEach((li) => {
          li.classList.remove("active");
          const a = li.querySelector("a");
          if (a && a.getAttribute("href") === `#${currentId}`) {
            li.classList.add("active");
          }
        });
      }
    });
  },
  {
    root: null, // observes viewport
    threshold: 0.5, // triggers when 50% of the section is visible
  }
);

// Observe each section
sections.forEach((section) => {
  observer.observe(section);
});

goTop.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

async function fetchData() {
  const url = "../assets/data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    const { soft, technical, technologies } = result.skills;
    renderSkills(soft, technical, technologies);

    renderProjects(result.projects);
  } catch (error) {
    console.error(error.message);
  }
}

function renderSkills(softSkills, technicalSkills, technologies) {
  const soft = document.getElementById("soft");
  const technical = document.getElementById("technical");
  const technologies_ = document.getElementById("technologies");

  softSkills.forEach((skill) => {
    const pargraph = document.createElement("p");
    pargraph.textContent = skill;
    soft.appendChild(pargraph);
  });

  technicalSkills.forEach((skill) => {
    const pargraph = document.createElement("p");
    pargraph.textContent = skill;
    technical.appendChild(pargraph);
  });

  technologies.forEach((tech) => {
    const { path, vars, abbr } = tech;
    const div = document.createElement("div");
    div.setAttribute("class", "tech");
    div.setAttribute("style", vars);
    div.setAttribute("data-abbr", abbr);
    const img = document.createElement("img");
    img.src = path;
    img.alt = path.split("/").pop().split(".")[0];
    div.appendChild(img);
    technologies_.appendChild(div);
  });
}

function renderProjects(projects) {
  const slider = document.getElementById("slider");
  let ps = "";
  const all = projects.length;
  let i = 1;

  projects.forEach((project) => {
    const { name, img, technologies, liveDemo } = project;

    ps += `<div class="slide">
      <div class="img" data-num="${i} / ${all}">
        <img 
          loading="lazy"
          src="${img}" 
          alt="${img.split("/").pop().split(".")[0]}" 
          style="--gif: '${img.replace(".png", ".gif")}'">
      </div>
      <h3>${name}</h3>
      <p>${technologies.join(", ")}</p>
      <a href="${liveDemo}" target="_blank">Live Demo</a>
    </div>`;

    i++;
  });

  slider.innerHTML = ps;

  let slides = Array.from(slider.children);

  function updateSlides() {
    slides.forEach((slide) => {
      slide.className = "slide";
      slide.style.display = "none";
    });

    // Only show the first 5 slides with positions
    slides.slice(0, 5).forEach((slide, index) => {
      slide.style.display = "flex";
      slide.classList.add(`position-${index}`);
    });
  }

  document.getElementById("next").addEventListener("click", () => {
    const first = slides.shift();
    slides.push(first);
    updateSlides();
  });

  document.getElementById("prev").addEventListener("click", () => {
    const last = slides.pop();
    slides.unshift(last);
    updateSlides();
  });

  // Initial setup
  updateSlides();
}
