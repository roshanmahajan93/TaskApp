import * as SQLite from 'expo-sqlite';
import type { Project, Task, TaskStatus } from '../types';

const DB_NAME = 'taskapp.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  await dbInstance.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      totalTasks INTEGER NOT NULL DEFAULT 0,
      progress REAL NOT NULL DEFAULT 0,
      dueDate TEXT,
      color TEXT NOT NULL DEFAULT '#000000',
      members INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      attachments INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      projectId TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      startsAt INTEGER NOT NULL,
      endsAt INTEGER NOT NULL,
      members INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      createdAt INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_starts ON tasks(startsAt);
    CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(projectId);
  `);
  await seedIfEmpty(dbInstance);
  return dbInstance;
}

async function seedIfEmpty(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM projects');
  if (row && row.c > 0) return;

  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const today = startOfDay.getTime();

  const projects: Project[] = [
    {
      id: 'p1',
      name: 'Dribbblers',
      totalTasks: 30,
      progress: 0.4,
      dueDate: '2026-06-20',
      color: '#0A0A0A',
      members: 5,
      comments: 3,
      attachments: 2,
      createdAt: now,
    },
    {
      id: 'p2',
      name: 'Behance',
      totalTasks: 17,
      progress: 0.6,
      dueDate: '2026-06-25',
      color: '#FFFFFF',
      members: 5,
      comments: 1,
      attachments: 4,
      createdAt: now,
    },
    {
      id: 'p3',
      name: 'Figma Mobile',
      totalTasks: 22,
      progress: 0.25,
      dueDate: '2026-07-02',
      color: '#C5F277',
      members: 4,
      comments: 8,
      attachments: 5,
      createdAt: now,
    },
  ];

  const h = (hour: number, min = 0) => today + hour * 3600_000 + min * 60_000;
  const tasks: Task[] = [
    { id: 't1', title: 'Finance Web page', projectId: 'p1', status: 'working', startsAt: h(9, 20), endsAt: h(11), members: 2, notes: null, createdAt: now },
    { id: 't2', title: 'Wireframes', projectId: 'p2', status: 'pending', startsAt: h(9, 30), endsAt: h(10, 30), members: 2, notes: null, createdAt: now },
    { id: 't3', title: 'Mobile App', projectId: 'p3', status: 'on_hold', startsAt: h(11), endsAt: h(12), members: 2, notes: null, createdAt: now },
    { id: 't4', title: 'Team Meeting', projectId: 'p1', status: 'pending', startsAt: h(13), endsAt: h(14), members: 3, notes: null, createdAt: now },
    { id: 't5', title: 'R&D and Documentation', projectId: 'p2', status: 'pending', startsAt: h(14, 30), endsAt: h(16), members: 2, notes: null, createdAt: now },
    { id: 't6', title: 'Mobile App Wireframes', projectId: 'p3', status: 'pending', startsAt: h(11), endsAt: h(12), members: 3, notes: null, createdAt: now },
    { id: 't7', title: 'Finance Web page', projectId: 'p1', status: 'completed', startsAt: h(10), endsAt: h(11), members: 2, notes: null, createdAt: now },
  ];

  await db.withTransactionAsync(async () => {
    for (const p of projects) {
      await db.runAsync(
        'INSERT INTO projects (id,name,totalTasks,progress,dueDate,color,members,comments,attachments,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [p.id, p.name, p.totalTasks, p.progress, p.dueDate, p.color, p.members, p.comments, p.attachments, p.createdAt]
      );
    }
    for (const t of tasks) {
      await db.runAsync(
        'INSERT INTO tasks (id,title,projectId,status,startsAt,endsAt,members,notes,createdAt) VALUES (?,?,?,?,?,?,?,?,?)',
        [t.id, t.title, t.projectId, t.status, t.startsAt, t.endsAt, t.members, t.notes, t.createdAt]
      );
    }
  });
}

export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.getAllAsync<Project>('SELECT * FROM projects ORDER BY createdAt DESC');
}

export async function listTasks(): Promise<Task[]> {
  const db = await getDb();
  return db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY startsAt ASC');
}

export async function insertTask(task: Task): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO tasks (id,title,projectId,status,startsAt,endsAt,members,notes,createdAt) VALUES (?,?,?,?,?,?,?,?,?)',
    [task.id, task.title, task.projectId, task.status, task.startsAt, task.endsAt, task.members, task.notes, task.createdAt]
  );
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

export async function getTask(id: string): Promise<Task | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
  return row ?? null;
}

export async function updateTask(task: Task): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE tasks SET title=?, projectId=?, status=?, startsAt=?, endsAt=?, members=?, notes=? WHERE id=?',
    [task.title, task.projectId, task.status, task.startsAt, task.endsAt, task.members, task.notes, task.id]
  );
}

export async function insertProject(project: Project): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO projects (id,name,totalTasks,progress,dueDate,color,members,comments,attachments,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [project.id, project.name, project.totalTasks, project.progress, project.dueDate, project.color, project.members, project.comments, project.attachments, project.createdAt]
  );
}

export async function getProject(id: string): Promise<Project | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Project>('SELECT * FROM projects WHERE id = ?', [id]);
  return row ?? null;
}

export async function updateProject(project: Project): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE projects SET name=?, totalTasks=?, progress=?, dueDate=?, color=?, members=?, comments=?, attachments=? WHERE id=?',
    [project.name, project.totalTasks, project.progress, project.dueDate, project.color, project.members, project.comments, project.attachments, project.id]
  );
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE tasks SET projectId = NULL WHERE projectId = ?', [id]);
    await db.runAsync('DELETE FROM projects WHERE id = ?', [id]);
  });
}
