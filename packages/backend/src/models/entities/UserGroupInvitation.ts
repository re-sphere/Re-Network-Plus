/*
 * SPDX-FileCopyrightText: syuilo and noridev and other misskey, cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { id } from '../id.js';
import { User } from './User.js';
import { UserGroup } from './UserGroup.js';

@Entity()
@Index(['userId', 'userGroupId'], { unique: true })
export class UserGroupInvitation {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the UserGroupInvitation.',
	})
	public createdAt: Date;

	@Index()
	@Column({
		...id(),
		comment: 'The user ID.',
	})
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: User | null;

	@Index()
	@Column({
		...id(),
		comment: 'The group ID.',
	})
	public userGroupId: UserGroup['id'];

	@ManyToOne(type => UserGroup, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public userGroup: UserGroup | null;
}
