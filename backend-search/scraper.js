const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// --- HELPER: Read File Helper ---
const loadHtmlFile = (filename) => {
    try {
        const filePath = path.join(__dirname, 'mock_sites', filename);
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading file ${filename}:`, err);
        return null;
    }
};

// --- PARSER 1: For District Portal (Table-based) ---
const scrapeDistrictPortal = () => {
    const html = loadHtmlFile('district_portal.html');
    if (!html) return [];

    const $ = cheerio.load(html);
    const jobs = [];

    // Logic: Find the table, iterate rows, skip non-jobs
    $('.govt-job-row').each((i, el) => {
        const titleRaw = $(el).find('td:nth-child(2)').text().trim(); // "Walk-in for Data Entry..."
        const dept = $(el).find('td:nth-child(3)').text().trim();     // "Health Dept"
        const deadline = $(el).find('td:nth-child(4)').text().trim(); // "25-Nov-2025"
        
        // Basic filtering: If it says "Tender", maybe we ignore it (or keep it)
        // For this demo, we clean up the title slightly
        const title = titleRaw.replace('NEW', '').trim();

        jobs.push({
            id: `dist_${i}`,
            title: title,
            company: dept, // Using Dept as Company
            location: "Varanasi District",
            deadline: deadline,
            source: "District Administration Portal",
            type: "Government",
            verified: false // Local media is unverified
        });
    });

    return jobs;
};

// --- PARSER 2: For University Board (Card-based) ---
const scrapeUniversityBoard = () => {
    const html = loadHtmlFile('university_board.html');
    if (!html) return [];

    const $ = cheerio.load(html);
    const jobs = [];

    // Logic: Find specific card classes
    $('.notice-card').each((i, el) => {
        const title = $(el).find('.role-title').text().trim();
        
        // Filter out "Seminars" if we only want jobs
        if(title.includes("Workshop") || title.includes("Seminar")) return;

        const company = $(el).find('.company-name').text().trim();
        const details = $(el).find('.details').text().trim();
        const datePosted = $(el).find('.date-badge').text().replace('Posted:', '').trim();

        jobs.push({
            id: `uni_${i}`,
            title: title,
            company: company,
            description: details, // Full text details
            datePosted: datePosted,
            source: "City Engg. College Placement Cell",
            type: "Private/Internship",
            verified: true // Trusted source (College)
        });
    });

    return jobs;
};

// Export functions
module.exports = { scrapeDistrictPortal, scrapeUniversityBoard };