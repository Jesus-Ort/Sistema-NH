<template>
    <v-app-bar color="primary" dark app>
        <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
        <v-divider vertical class="ma-1"/>
        <v-toolbar-title>Convit</v-toolbar-title>
        <v-divider vertical class="ma-1"/>
        <v-btn class="ma-1" icon to="/home">
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn class="ma-1" icon to="/pacientes">
            <v-icon>mdi-account-group</v-icon>
        </v-btn>
        <v-btn class="ma-1" icon to="/vacunas">
            <v-icon>mdi-needle</v-icon>
        </v-btn>
    </v-app-bar>
</template>