-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "PetEnvironment" AS ENUM ('OPEN', 'CLOSE', 'BOTH');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "size" "PetSize" NOT NULL,
    "energy_level" INTEGER NOT NULL,
    "environment" "PetEnvironment" NOT NULL,
    "photos" TEXT[],

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "pet_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adopt_requeriments" (
    "id" TEXT NOT NULL,
    "requeriment" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "adopt_requeriments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pet_photos" ADD CONSTRAINT "pet_photos_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adopt_requeriments" ADD CONSTRAINT "adopt_requeriments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
