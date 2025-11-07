<!-- components/QRCode.vue -->
<script setup lang="ts">
import { useQRCode } from "@vueuse/integrations/useQRCode";

const websiteUrl = "https://the-standard-deviants.gigready.band";
const qrCode = useQRCode(websiteUrl);
</script>

<template>
    <img :src="qrCode" alt="QR code" />
</template>
