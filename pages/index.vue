<script lang="ts" setup>
// QR code generation will be handled manually using the 'qrcode' library
import { useClipboard } from "@vueuse/core";

// Define types for our data structures
interface SocialLink {
    label: string;
    url: string;
    icon: string;
    color: string;
}

interface Show {
    date: string;
    time: string;
    venue: string;
    location: string;
    venueUrl: string;
    mapUrl: string;
}

interface BandProject {
    label: string;
    url: string;
    icon: string;
}

// Social media links with icons
const socialLinks: SocialLink[] = [
    {
        label: "Facebook",
        url: "https://www.facebook.com/the.standard.deviants.band",
        icon: "i-simple-icons-facebook",
        color: "blue",
    },
    {
        label: "Instagram",
        url: "https://www.instagram.com/the.standard.deviants/",
        icon: "i-simple-icons-instagram",
        color: "pink",
    },
];

// All shows
const allShows: Show[] = [
    {
        date: "November 8, 2025",
        time: "5:30 PM - 7:30 PM",
        venue: "Jannafest 2.0 Private Party",
        location: "Imperial Beach, San Diego, CA",
        venueUrl: "",
        mapUrl: "https://maps.app.goo.gl/NJXPEf2KrvYWHMVh7",
    },
    {
        date: "October 5, 2025",
        time: "6:00 PM - 9:00 PM",
        venue: "The Cordova Bar",
        location: "1319 Morena Blvd, San Diego, CA 92110",
        venueUrl:
            "https://www.thecordovabar.com/?utm_source=the_standard_deviants_band&utm_medium=web",
        mapUrl: "https://maps.app.goo.gl/b27gyVF1L1bMzaMf6",
    },
    {
        date: "September 6, 2025",
        time: "7:30 PM - 9:00 PM",
        venue: "Good Bar",
        location: "1872 Rosecrans St, San Diego, CA 92106",
        venueUrl:
            "https://www.goodbarsd.com/?utm_source=the_standard_deviants_band&utm_medium=web",
        mapUrl: "https://maps.app.goo.gl/Cngeao6sgWADdG7r7",
    },
    {
        date: "August 4, 2025",
        time: "11:00 AM - 4:00 PM",
        venue: "Caddyhack Charity Golf Tournament - Fairbanks Ranch",
        location: "15150 San Dieguito Rd, Rancho Santa Fe, CA 92067",
        venueUrl:
            "https://boystomen.org/caddyhack-golf-festival/?utm_source=the_standard_deviants_band&utm_medium=web",
        mapUrl: "https://maps.app.goo.gl/B5Y4TvHT5qDtg2v5A",
    },
    {
        date: "August 2, 2025",
        time: "2:00 PM - 5:00 PM",
        venue: "Renamyfest Private Party",
        location: "Spanish Landing East, San Diego, CA",
        venueUrl: "",
        mapUrl: "https://maps.app.goo.gl/PeoSpgJafb4kyokm6",
    },
    {
        date: "June 28, 2025",
        time: "4:00 PM - 6:00 PM",
        venue: "Quin Murphy Foundation Private Party",
        location: "Chula Vista, San Diego, CA",
        venueUrl:
            "https://www.quinmurphyfoundation.com/?utm_source=the_standard_deviants_band&utm_medium=web",
        mapUrl: "https://maps.app.goo.gl/xiwvS9T3kFutLnEJ8",
    },
    {
        date: "June 7, 2025",
        time: "5:00 PM - 6:00 PM",
        venue: "Good Bar",
        location: "1872 Rosecrans St, San Diego, CA 92106",
        venueUrl:
            "https://www.goodbarsd.com/?utm_source=the_standard_deviants_band&utm_medium=web",
        mapUrl: "https://maps.app.goo.gl/Cngeao6sgWADdG7r7",
    },
    {
        date: "June 1, 2025",
        time: "10:00 AM - 11:00 AM",
        venue: "Rock & Roll Marathon",
        location: "5th & B Street - Downtown San Diego, CA",
        venueUrl:
            "https://www.runrocknroll.com/events/san-diego/?utm_source=the_standard_deviants_band&utm_medium=web",
        mapUrl: "https://maps.app.goo.gl/ihGHaGonRukUHHwU8",
    },
    {
        date: "November 9, 2024",
        time: "1:30 PM - 3:30 PM",
        venue: "Jannafest Private Party",
        location: "Imperial Beach, San Diego, CA",
        venueUrl: "",
        mapUrl: "https://maps.app.goo.gl/NJXPEf2KrvYWHMVh7",
    },
    {
        date: "August 31, 2024",
        time: "4:00 PM - 5:00 PM",
        venue: "Renéfest Private Party",
        location: "South Park, San Diego, CA",
        venueUrl: "",
        mapUrl: "https://maps.app.goo.gl/WJKuz2SUodprA1VS9",
    },
];

// Parse date string to Date object with proper error handling
const parseDate = (dateStr: string): Date => {
    try {
        const date = new Date(dateStr);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date format: ${dateStr}`);
            return new Date(0); // Return epoch date for invalid dates
        }
        return date;
    } catch (error) {
        console.error(`Error parsing date: ${dateStr}`, error);
        return new Date(0); // Return epoch date for errors
    }
};

// Current date for comparison
const today = new Date();
// Reset time to beginning of day for accurate comparison
today.setHours(0, 0, 0, 0);

// Function to generate iCalendar file for a show
const generateCalendarFile = (show: Show): string => {
    // Parse the date and time
    const showDate = parseDate(show.date);

    // Extract start and end times from the time string (format: "10:10 AM - 11:50 AM")
    const timeRegex = /(\d+:\d+ [AP]M) - (\d+:\d+ [AP]M)/;
    const timeMatch = show.time.match(timeRegex);

    let startTime = "";
    let endTime = "";

    if (timeMatch && timeMatch.length >= 3) {
        startTime = timeMatch[1];
        endTime = timeMatch[2];
    } else {
        // Default to the whole day if time format doesn't match
        startTime = "12:00 AM";
        endTime = "11:59 PM";
    }

    // Create start and end date objects
    const startDate = new Date(showDate);
    const endDate = new Date(showDate);

    // Parse and set the start and end times
    if (startTime) {
        const startTimeMatch = startTime.match(/(\d+):(\d+) ([AP]M)/);
        if (startTimeMatch) {
            const [_, startHours, startMinutes, startPeriod] = startTimeMatch;
            startDate.setHours(
                parseInt(startHours) +
                    (startPeriod === "PM" && parseInt(startHours) !== 12
                        ? 12
                        : 0),
                parseInt(startMinutes),
                0,
                0,
            );
        }
    }

    if (endTime) {
        const endTimeMatch = endTime.match(/(\d+):(\d+) ([AP]M)/);
        if (endTimeMatch) {
            const [_, endHours, endMinutes, endPeriod] = endTimeMatch;
            endDate.setHours(
                parseInt(endHours) +
                    (endPeriod === "PM" && parseInt(endHours) !== 12 ? 12 : 0),
                parseInt(endMinutes),
                0,
                0,
            );
        }
    }

    // Format dates for iCalendar
    const formatDate = (date: Date): string => {
        return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const now = formatDate(new Date());
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    // Create iCalendar content
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//The Standard Deviants//Show Calendar//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `DTSTAMP:${now}`,
        `UID:${start}-${Math.random().toString(36).substring(2, 11)}@ugartesolutions.com`,
        `SUMMARY:The Standard Deviants at ${show.venue}`,
        `DESCRIPTION:The Standard Deviants performing at ${show.venue}. ${show.location}`,
        `LOCATION:${show.location}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    return icsContent;
};

// Function to trigger calendar download
const downloadCalendar = (show: Show): void => {
    const icsContent = generateCalendarFile(show);
    const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
        "download",
        `the-standard-deviants-${show.venue.replace(/\s+/g, "-").toLowerCase()}.ics`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Computed properties to filter shows
const upcomingShows = computed(() => {
    return allShows
        .filter((show) => {
            const showDate = parseDate(show.date);
            return showDate >= today;
        })
        .sort(
            (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime(),
        );
});

const pastShows = computed(() => {
    return allShows
        .filter((show) => {
            const showDate = parseDate(show.date);
            return showDate < today;
        })
        .sort(
            (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
        ); // Sort in reverse chronological order
});

// Website URL for the clipboard
const websiteUrl = "https://the-standard-deviants.gigready.band";

// Setup clipboard functionality
const { copy: copyToClipboard, copied } = useClipboard();

// Set up head meta tags
useHead({
    title: "The Standard Deviants",
    meta: [
        {
            name: "description",
            content:
                "A fun rock cover band forged from local San Diego musicians. We're professionals by day, rock stars by night, and we deliver well-known 70s/80s/90s/00s rock anthems that deviate from the standard at times. Come see fun nerds who rock - coming soon to a venue near you!",
        },
    ],
    link: [
        {
            rel: "apple-touch-icon",
            href: "/apple-touch-icon.png",
            sizes: "180x180",
        },
        {
            rel: "icon",
            type: "image/png",
            href: "/favicon-32x32.png",
            sizes: "32x32",
        },
        {
            rel: "icon",
            type: "image/png",
            href: "/favicon-16x16.png",
            sizes: "16x16",
        },
        { rel: "manifest", href: "/site.webmanifest" },
    ],
});

// Set up SEO meta tags
useSeoMeta({
    title: "The Standard Deviants",
    description:
        "A fun rock cover band forged from local San Diego musicians. We're professionals by day, rock stars by night, and we deliver well-known 70s/80s/90s/00s rock anthems that deviate from the standard at times. Come see fun nerds who rock - coming soon to a venue near you!",
    ogTitle: "The Standard Deviants",
    ogDescription:
        "A fun rock cover band forged from local San Diego musicians. We're professionals by day, rock stars by night, and we deliver well-known 70s/80s/90s/00s rock anthems that deviate from the standard at times. Come see fun nerds who rock - coming soon to a venue near you!",
    ogImage: "https://the-standard-deviants.gigready.band/og-logo.png",
});
</script>

<template>
    <div
        class="min-h-screen bg-linear-to-b from-secondary-800 to-secondary-950 dark:from-secondary-800 dark:to-black text-neutral-100 dark:text-neutral-400"
    >
        <div class="container mx-auto px-4 py-12 max-w-3xl">
            <!-- Header with band logo/image -->
            <div class="flex flex-col items-center mb-10">
                <!-- Logo -->
                <img
                    src="/logo.png"
                    alt="The Standard Deviants"
                    class="mx-auto mb-12"
                />
                <h2
                    class="text-2xl font-bold text-center mb-2 text-primary-50 dark:text-primary-100 font-serif"
                >
                    San Diego Rock Cover Band
                </h2>
                <p class="text-center text-white max-w-md mb-8">
                    A fun rock cover band forged from local San Diego musicians.
                    We're professionals by day, rock stars by night, and we
                    deliver well-known 70s/80s/90s/00s rock anthems that deviate
                    from the standard at times. Come see fun nerds who rock -
                    coming soon to a venue near you!
                </p>
                <p class="text-center text-white max-w-md mb-8">
                    Harrison &middot; Ren&eacute; &middot; Steve &middot; Tony
                    &middot; Ritter
                </p>
            </div>

            <!-- Social Media Links -->
            <div class="grid gap-4 mb-10">
                <UButton
                    v-for="(link, index) in socialLinks"
                    :key="index"
                    color="primary"
                    block
                    size="xl"
                    :to="link.url"
                    target="_blank"
                    class="flex items-center justify-between py-6 px-6 rounded-xl transition-transform hover:scale-105 shadow-md border border-primary-500/30 dark:text-white"
                >
                    <span class="text-xl font-medium">{{ link.label }}</span>
                    <div class="flex items-center">
                        <UIcon :name="link.icon" class="text-2xl" />
                        <UIcon name="i-heroicons-chevron-right" class="ml-2" />
                    </div>
                </UButton>
            </div>

            <!-- Upcoming Shows -->
            <div
                class="bg-secondary-500/80 dark:bg-secondary-500/80 rounded-xl p-6 mb-10 border border-primary-500/20 dark:border-primary-500/20"
            >
                <h2
                    class="text-2xl font-bold mb-4 flex items-center font-serif"
                >
                    <UIcon name="i-heroicons-calendar" class="mr-2" />
                    Upcoming Shows!
                </h2>
                <div v-if="upcomingShows.length > 0" class="space-y-4">
                    <div
                        v-for="(show, index) in upcomingShows"
                        :key="index"
                        class="border-l-4 border-primary-500 dark:border-primary-500 pl-4 py-2"
                    >
                        <div class="font-bold">{{ show.date }}</div>
                        <div>{{ show.time }}</div>
                        <div>{{ show.venue }}</div>
                        <div class="text-sm text-white dark:text-white">
                            {{ show.location }}
                        </div>
                        <div
                            class="flex space-x-2 mt-2 md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0"
                        >
                            <UButton
                                v-if="show.mapUrl"
                                :to="show.mapUrl"
                                target="_blank"
                                size="xl"
                                class="md:w-auto w-full dark:text-white"
                            >
                                <UIcon
                                    name="i-heroicons-map-pin"
                                    class="mr-1"
                                />
                                Map
                            </UButton>
                            <UButton
                                v-if="show.venueUrl"
                                :to="show.venueUrl"
                                target="_blank"
                                size="xl"
                                class="md:w-auto w-full dark:text-white"
                            >
                                <UIcon
                                    name="i-heroicons-globe-alt"
                                    class="mr-1"
                                />
                                Venue
                            </UButton>
                            <UButton
                                @click="downloadCalendar(show)"
                                size="xl"
                                class="md:w-auto w-full dark:text-white"
                            >
                                <UIcon
                                    name="i-heroicons-calendar"
                                    class="mr-1"
                                />
                                Calendar Invite
                            </UButton>
                        </div>
                    </div>
                </div>
                <div v-else class="text-white dark:text-white italic">
                    No upcoming shows at the moment. Check back soon!
                </div>
            </div>

            <!-- Past Shows -->
            <div
                class="bg-secondary-500/80 dark:bg-secondary-500/80 rounded-xl p-6 mb-10 border border-primary-500/20 dark:border-primary-500/20"
            >
                <h2
                    class="text-2xl font-bold mb-4 flex items-center font-serif"
                >
                    <UIcon name="i-heroicons-clock" class="mr-2" />
                    Past Shows
                </h2>
                <div v-if="pastShows.length > 0" class="space-y-4">
                    <div
                        v-for="(show, index) in pastShows"
                        :key="index"
                        class="border-l-4 border-primary-500 dark:border-primary-500 pl-4 py-2"
                    >
                        <div class="font-bold">{{ show.date }}</div>
                        <div>{{ show.time }}</div>
                        <div>{{ show.venue }}</div>
                        <div class="text-sm text-white dark:text-white">
                            {{ show.location }}
                        </div>
                        <div
                            class="flex space-x-2 mt-2 md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0"
                        >
                            <UButton
                                v-if="show.mapUrl"
                                :to="show.mapUrl"
                                target="_blank"
                                size="xl"
                                class="md:w-auto w-full dark:text-white"
                            >
                                <UIcon
                                    name="i-heroicons-map-pin"
                                    class="mr-1"
                                />
                                Map
                            </UButton>
                            <UButton
                                v-if="show.venueUrl"
                                :to="show.venueUrl"
                                target="_blank"
                                size="xl"
                                class="md:w-auto w-full dark:text-white"
                            >
                                <UIcon
                                    name="i-heroicons-globe-alt"
                                    class="mr-1"
                                />
                                Venue
                            </UButton>
                            <UButton
                                v-if="show.venueUrl"
                                @click="downloadCalendar(show)"
                                size="xl"
                                class="md:w-auto w-full dark:text-white"
                            >
                                <UIcon
                                    name="i-heroicons-calendar"
                                    class="mr-1"
                                />
                                Calendar Invite
                            </UButton>
                        </div>
                    </div>
                </div>
                <div v-else class="text-white dark:text-white italic">
                    No past shows to display.
                </div>
            </div>

            <!-- Contact Section -->
            <div
                class="bg-secondary-500/80 dark:bg-secondary-500/80 rounded-xl p-6 mb-10 text-center border border-primary-500/20 dark:border-primary-500/20"
            >
                <h2 class="text-2xl font-bold mb-4 font-serif">
                    Book Us For Your Event!
                </h2>
                <p class="mb-4">
                    Looking for a band that will get everyone on their feet?
                </p>
                <UButton
                    :to="'mailto:the.standard.deviants@ugartesolutions.com'"
                    size="lg"
                    class="font-bold transition-all duration-300 hover:bg-opacity-90 dark:text-white"
                >
                    <UIcon name="i-heroicons-envelope" class="mr-2" />
                    Contact Us
                </UButton>
            </div>

            <!-- Share This Page! -->
            <div
                class="bg-secondary-500/80 dark:bg-secondary-500/80 rounded-xl p-6 text-center border border-primary-500/20 dark:border-primary-500/20"
            >
                <h2 class="text-2xl font-bold mb-4 font-serif">
                    Share This Page!
                </h2>
                <p class="mb-4">
                    Scan the QR code or copy the link to share this page with
                    your friends!
                </p>
                <div class="flex flex-col items-center">
                    <img
                        src="/qr-code.png"
                        alt="QR Code"
                        class="w-48 h-48 mb-4"
                    />
                    <UButton
                        @click="copyToClipboard(websiteUrl)"
                        size="lg"
                        class="dark:text-white"
                    >
                        <UIcon
                            :name="
                                copied
                                    ? 'i-heroicons-check'
                                    : 'i-heroicons-clipboard'
                            "
                            class="mr-2"
                        />
                        {{ copied ? "Copied!" : "Copy Link" }}
                    </UButton>
                </div>
            </div>

            <!-- Footer -->
            <footer
                class="mt-12 text-center text-sm text-neutral-400/60 dark:text-neutral-400/60"
            >
                <p>
                    © {{ new Date().getFullYear() }} The Standard Deviants. All
                    rights reserved.
                </p>
            </footer>
        </div>
    </div>
</template>
