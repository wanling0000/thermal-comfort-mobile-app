export async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'thermal-comfort-app/1.0 (wanling@example.com)',
                },
            }
        );
        const data = await response.json();
        const address = data.address;

        if (!address) {
            return `Unnamed Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
        }

        const fallbackOptions = [
            // Most specific
            [address.building, address.road],
            [address.road, address.city],
            [address.suburb, address.city],
            [address.city, address.state],
            // Display name fallback
            [data.display_name],
        ];

        for (const parts of fallbackOptions) {
            const valid = parts.filter(Boolean);
            if (valid.length) {
                return valid.join(', ');
            }
        }

        return `Unnamed Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;

    } catch (err) {
        console.error('[reverseGeocode] Failed to fetch address', err);
        return `Unnamed Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
}
