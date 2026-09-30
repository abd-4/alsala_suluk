const ahadith = [
  { text: "إنَّما الأَعْمالُ بالنِّيَّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى", source: "رواه البخاري ومسلم" },
  { text: "مَنْ كانَ يُؤْمِنُ باللَّهِ والْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", source: "رواه البخاري ومسلم" },
  { text: "لا تَغَضَبْ", source: "كررها مراراً، رواه البخاري" },
  { text: "الدِّينُ النَّصِيحَةُ", source: "رواه مسلم" },
  { text: "مَنْ غَشَّنَا فَلَيْسَ مِنَّا", source: "رواه مسلم" },
  { text: "المُسْلِمُ مَنْ سَلِمَ المُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", source: "رواه البخاري ومسلم" },
  { text: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", source: "رواه الترمذي وحسنه" },
  { text: "لا يَرْحَمُ اللَّهُ مَنْ لا يَرْحَمُ النَّاسَ", source: "رواه البخاري ومسلم" },
  { text: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", source: "رواه البخاري ومسلم" },
  { text: "لا يُؤْمِنُ أحَدُكُمْ حتَّى يُحِبَّ لأَخِيهِ ما يُحِبُّ لِنَفْسِهِ", source: "رواه البخاري ومسلم" }
];

function setDailyHadith() {
    const startDate = new Date(2026, 8, 30);
    const today = new Date();
    startDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = Math.abs(diffDays) % ahadith.length;
    
    document.getElementById('hadith-text').innerText = `«${ahadith[index].text}»`;
    document.getElementById('hadith-source').innerText = `[${ahadith[index].source}]`;
}

function formatTime12(timeStr) {
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours);
    let period = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12;
    let formattedHours = hours < 10 ? '0' + hours : hours;
    return {
        time: `${formattedHours}:${minutes}`,
        period: period
    };
}

const daysArabic = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

async function fetchPrayerTimes() {
    const lat = 36.588789;
    const lng = 39.130397;
    const method = 4;

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}`);
        const data = await response.json();
        
        if (data.code === 200) {
            const timings = data.data.timings;
            const dateData = data.data.date;

            document.getElementById('gregorian-date').innerText = dateData.gregorian.date.split('-').reverse().join(' - ');
            document.getElementById('hijri-date').innerText = `${dateData.hijri.day} ${dateData.hijri.month.ar} ${dateData.hijri.year}`;
            
            // تحديد اسم اليوم باللغة العربية بدقة
            const todayIndex = new Date().getDay();
            document.getElementById('current-day').innerText = daysArabic[todayIndex];

            const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            const ids = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

            prayers.forEach((prayer, i) => {
                const formatted = formatTime12(timings[prayer]);
                document.getElementById(ids[i]).innerText = formatted.time;
                document.getElementById(`${ids[i]}-p`).innerText = formatted.period;
            });
        }
    } catch (error) {
        console.error("خطأ في جلب الأوقات:", error);
    }
}

window.onload = function() {
    setDailyHadith();
    fetchPrayerTimes();
};
