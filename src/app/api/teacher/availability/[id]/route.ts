import { NextRequest, NextResponse } from "next/server";

import { requireAuthWithRole } from "@/_lib/auth";
import { prisma } from "@/_lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuthWithRole(request, ["TEACHER"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring } =
      body as {
        dayOfWeek?: number;
        specificDate?: string;
        startTime?: string;
        endTime?: string;
        isRecurring?: boolean;
      };

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Perfil de professor não encontrado." },
        { status: 404 },
      );
    }

    const existingAvailability = await prisma.availability.findUnique({
      where: { id },
    });

    if (!existingAvailability) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada." },
        { status: 404 },
      );
    }

    if (existingAvailability.teacherId !== teacher.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta disponibilidade." },
        { status: 403 },
      );
    }

    const updatedAvailability = await prisma.availability.update({
      where: { id },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(specificDate !== undefined && {
          specificDate: specificDate ? new Date(specificDate) : null,
        }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(isRecurring !== undefined && { isRecurring }),
      },
    });

    return NextResponse.json(
      {
        availability: updatedAvailability,
        message: "Disponibilidade atualizada com sucesso.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao atualizar disponibilidade:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuthWithRole(request, ["TEACHER"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const { id } = await params;

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Perfil de professor não encontrado." },
        { status: 404 },
      );
    }

    const existingAvailability = await prisma.availability.findUnique({
      where: { id },
    });

    if (!existingAvailability) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada." },
        { status: 404 },
      );
    }

    if (existingAvailability.teacherId !== teacher.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para deletar esta disponibilidade." },
        { status: 403 },
      );
    }

    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Disponibilidade removida com sucesso.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao deletar disponibilidade:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
