#!c:strawberry/perl/bin/perl.exe

use strict;
use warnings;

sub main {
    print "Calculadora\n";
    print "--------------------------\n";
    
    print "Ingrese la operacion: ";
    chomp(my $input = <STDIN>);

    # Separa el input en 3 numero 1, operacion y numero 2
    my ($num1, $op, $num2) = split(/\s+/, $input);

    # Verifica que sean valores numericos
    if (!es_numero($num1) || !es_numero($num2)) {
        print "Error: Valores no numericos!\n";
        return;
    }

    if ($op eq '+') {
        print "$num1 + $num2 = ", $num1 + $num2, "\n";
    }
    elsif ($op eq '-') {
        print "$num1 - $num2 = ", $num1 - $num2, "\n";
    }
    elsif ($op eq '*') {
        print "$num1 * $num2 = ", $num1 * $num2, "\n";
    }
    elsif ($op eq '/') {
        if ($num2 == 0) {
            print "Error: Division por 0!\n";
        } else {
            print "$num1 / $num2 = ", $num1 / $num2, "\n";
        }
    }
    else {
        print "Operacion invalida!\n";
    }
}

# funcion para verificar si un valor parece numerico
sub es_numero {
    my $value = shift;
    return $value =~ /^-?\d+\.?\d*$/;
}

main();