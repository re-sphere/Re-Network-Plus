/*
 * SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AddSomeUrls1557761316509 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "ToSUrl" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "repositoryUrl" character varying(512) NOT NULL DEFAULT 'https://github.com/re-sphere/re-network-plus'`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "feedbackUrl" character varying(512) DEFAULT 'https://github.com/re-sphere/re-network-plus/issues/new'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "feedbackUrl"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "repositoryUrl"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "ToSUrl"`);
    }
}
