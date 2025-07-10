import type { Handle, ServerInit } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { docsBuilder } from '$lib/docs-builder';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '$lib/server/db';
import path from 'path';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handle: Handle = handleAuth;

function hookInit(): ServerInit {
	return async () => {
		try {
			await migrate(db, { migrationsFolder: path.resolve('.') + '/drizzle' });
			await docsBuilder();
		} catch (error) {
			console.error('Server initialization error:', error);
			process.exit(1);
		}
	};
}
export const init: ServerInit = hookInit();
