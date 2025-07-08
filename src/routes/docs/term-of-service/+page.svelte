<script lang="ts">
	import { PUBLIC_ORIGIN } from '$env/static/public';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const config = {
		contactEmail: 'joe@wows.ai',
		updateDate: '2025-07-08',
		privacyPolicyUrl: `${PUBLIC_ORIGIN}/privacy-policy`
	};
</script>

<br />
<div
	class="max-w-3xl mx-auto px-6 py-10 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200 text-gray-800"
>
	<h1 class="text-3xl font-bold text-blue-700 mb-8">API Terms of Use</h1>
	<section class="mb-8">
		<p>
			Welcome to our API service (“the Service”). Please read these Terms of Use (“Terms”) carefully
			before you use our API. By accessing or using our API, you agree to be bound by these Terms.
		</p>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">1. Service Description</h2>
		<p>
			Our API is designed to help developers integrate applications and automate data exchange. We
			reserve the right to update, modify, suspend, or discontinue the API or any part of the
			Service at any time without notice.
		</p>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">2. Registration and Authorization</h2>
		<ul class="list-disc list-inside space-y-1">
			<li>You may need to register for an account and obtain an API key to access the Service.</li>
			<li>
				You are responsible for maintaining the confidentiality of your API key. Do not share,
				transfer, or disclose your key to others.
			</li>
			<li>
				You must not access or attempt to access the Service by any means other than as permitted by
				us.
			</li>
		</ul>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">3. Acceptable Use</h2>
		<ul class="list-disc list-inside space-y-1">
			<li>You must not use the Service for any unlawful, infringing, or prohibited purpose.</li>
			<li>
				Automated scripts or high-frequency requests (such as DDoS attacks) that disrupt the Service
				are strictly prohibited.
			</li>
			<li>
				Reverse engineering, decoding, or attempting to extract the source code of the Service is
				not allowed.
			</li>
		</ul>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">4. Intellectual Property</h2>
		<ul class="list-disc list-inside space-y-1">
			<li>
				All content related to the Service (including but not limited to documentation, design, and
				API structure) is owned by us or our licensors.
			</li>
			<li>
				You may use the Service only as expressly permitted in these Terms. No other rights are
				granted.
			</li>
		</ul>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">5. Privacy</h2>
		<p>
			Any personal data you provide while using the API will be managed in accordance with our
			<a href={config.privacyPolicyUrl} class="text-blue-700 underline hover:text-blue-900">Privacy Policy</a>.
		</p>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">6. Disclaimer</h2>
		<ul class="list-disc list-inside space-y-1">
			<li>
				The Service is provided “as is” and “as available”. We do not warrant that the Service will
				be error-free or uninterrupted.
			</li>
			<li>
				We are not liable for any direct, indirect, incidental, or consequential damages arising
				from your use or inability to use the Service.
			</li>
		</ul>
	</section>

	<section class="mb-6">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">7. Changes and Termination</h2>
		<ul class="list-disc list-inside space-y-1">
			<li>
				We may change, suspend, or terminate the Service at any time and are not responsible for any
				data loss resulting from such actions.
			</li>
			<li>
				Changes to these Terms will be posted on this page. Please review this page regularly.
			</li>
		</ul>
	</section>

	<section class="mb-8">
		<h2 class="text-xl font-semibold text-blue-600 mb-2">8. Governing Law</h2>
		<p>
			These Terms are governed by the laws of <span class="font-semibold">[Your Jurisdiction]</span
			>. Any disputes shall be subject to the exclusive jurisdiction of the courts located in
			<span class="font-semibold">[Your City]</span>.
		</p>
	</section>

	<section>
		<p>
			If you have any questions about these Terms, please contact us at
			<a href="mailto:support@yourcompany.com" class="text-blue-700 underline hover:text-blue-900"
				>{config.contactEmail}</a
			>.
		</p>
		<p class="text-sm text-gray-500 mt-2">Last updated: {config.updateDate}</p>
	</section>
</div>
<br />
