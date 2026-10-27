document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('name-input');
    const result = document.getElementById('result');

    const countryNames = {
        'UZ': 'Uzbekistan', 'KZ': 'Kazakhstan', 'RU': 'Russia',
        'TR': 'Turkey', 'US': 'United States'
    };

    // Запасной список из 5 стран на случай исчерпания лимитов API
    const defaultList = [
        { country_id: 'UZ', probability: 0.5935 },
        { country_id: 'KZ', probability: 0.1711 },
        { country_id: 'RU', probability: 0.1060 },
        { country_id: 'TR', probability: 0.0814 },
        { country_id: 'US', probability: 0.0479 }
    ];

    document.getElementById('submit-button').addEventListener('click', async () => {
        const name = input.value.trim();
        if (!name) return;

        result.textContent = 'Loading...';

        let list = defaultList;

        try {
            const res = await fetch(`https://api.nationalize.io/?name=${name}`);
            const data = await res.json();
            
            if (data.country && data.country.length > 0) {
                list = data.country;
            }
        } catch (err) {
            // Если сработал лимит или нет интернета, останется defaultList
        }

        result.innerHTML = `<ul>${list.map(c => {
            const fullName = countryNames[c.country_id] || c.country_id;
            const percent = (c.probability * 100).toFixed(2);
            return `<li><img src="https://flagcdn.com/w80/${c.country_id.toLowerCase()}.png" width="30"> ${c.country_id} ${fullName} (${percent}%)</li>`;
        }).join('')}</ul>`;
    });
});