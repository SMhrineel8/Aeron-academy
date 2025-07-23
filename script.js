document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const mainContent = document.getElementById('main-content');

    // Toggle hamburger menu
    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Handle navigation clicks to show/hide sections
    navLinks.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault(); // Prevent default link behavior
            const targetPage = event.target.dataset.page; // Get the data-page attribute

            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show the target section
            if (targetPage) {
                const sectionToShow = document.getElementById(`${targetPage}-section`);
                if (sectionToShow) {
                    sectionToShow.classList.add('active');
                }
            } else {
                // If no specific page is targeted (e.g., clicking on logo, or if data-page is missing),
                // default to showing the home section.
                document.getElementById('home-section').classList.add('active');
            }

            // Close the hamburger menu on navigation (for mobile)
            navLinks.classList.remove('active');
        }
    });

    // Initial load: ensure home section is active if no other section is specified
    if (!document.querySelector('.content-section.active')) {
        document.getElementById('home-section').classList.add('active');
    }

    // Example of dynamically adding courses (you'd replace this with API calls)
    const courseList = document.getElementById('course-list');
    const courses = [
        {
            title: "Introduction to Python Programming",
            description: "A beginner-friendly course to learn Python fundamentals.",
            youtubeLink: "https://www.youtube.com/watch?v=rfscVS0vtbw" // Example YouTube link
        },
        {
            title: "React JS Crash Course",
            description: "Build modern web applications with React.",
            youtubeLink: "https://www.youtube.com/watch?v=Dorf8i6EX4U" // Example YouTube link
        }
    ];

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <a href="${course.youtubeLink}" target="_blank">Watch on YouTube</a>
        `;
        courseList.appendChild(courseCard);
    });
});
